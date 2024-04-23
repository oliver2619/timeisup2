import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectProjectComponent } from "../../elements/select-project/select-project.component";
import { SelectTaskComponent } from "../../elements/select-task/select-task.component";
import { TimeEditComponent } from "../../elements/time-edit/time-edit.component";
import { HoursPipe } from "../../elements/hours.pipe";
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { DurationPipe } from '../../elements/duration.pipe';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { selectAccounting } from '../../selector/accounting-selectors';
import { AccountingService } from '../../service/accounting.service';
import { RecordState } from '../../state/record-state';

export interface RecordEditRouteParams {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly index: string;
}

interface RecordEditFormValue {
  startHour: number;
  endHour: number;
  startMinute: number;
  endMinute: number;
  project: string;
  task: string;
}

@Component({
  selector: 'tiu-record-edit',
  standalone: true,
  templateUrl: './record-edit.component.html',
  styleUrl: './record-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, SelectProjectComponent, SelectTaskComponent, HoursPipe, DurationPipe, TimeEditComponent, HelpButtonDirective]
})
export class RecordEditComponent {

  readonly formGroup: FormGroup;

  hasEnd = true;

  private recordingIndex = 0;
  private year = 0;
  private month = 0;
  private day = 0;
  private startDate = new Date(0);
  private records: RecordState[] = [];

  get canAlignBackwards(): boolean {
    return this.recordingIndex > 0 && this.records[this.recordingIndex - 1].endTime != undefined;
  }

  get canAlignForwards(): boolean {
    return this.recordingIndex + 1 < this.records.length;
  }

  get endHourCtrl(): FormControl<number> {
    return this.formGroup.controls['endHour'] as FormControl<number>;
  }

  get endMinuteCtrl(): FormControl<number> {
    return this.formGroup.controls['endMinute'] as FormControl<number>;
  }

  get startHourCtrl(): FormControl<number> {
    return this.formGroup.controls['startHour'] as FormControl<number>;
  }

  get startMinuteCtrl(): FormControl<number> {
    return this.formGroup.controls['startMinute'] as FormControl<number>;
  }

  get canSave(): boolean {
    return this.formGroup.valid;
  }

  get durationHours(): number {
    if (this.hasEnd && this.formGroup.valid) {
      const v = this.value;
      const h = (v.endHour - v.startHour + (v.endMinute - v.startMinute) / 60);
      return h >= 0 ? h : h + 24;
    } else {
      return 0;
    }
  }

  get projectControl(): FormControl<string> {
    return this.formGroup.controls['project'] as FormControl;
  }

  get taskControl(): FormControl<string> {
    return this.formGroup.controls['task'] as FormControl;
  }

  private get value(): RecordEditFormValue {
    return this.formGroup.value as RecordEditFormValue;
  }

  private set value(v: RecordEditFormValue) {
    this.formGroup.setValue(v);
  }

  constructor(private readonly router: Router, private readonly accountingService: AccountingService, store: Store, formBuilder: FormBuilder, activatedRoute: ActivatedRoute) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('startHour', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(23)]));
    this.formGroup.addControl('endHour', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(23)]));
    this.formGroup.addControl('startMinute', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(59)]));
    this.formGroup.addControl('endMinute', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(59)]));
    this.formGroup.addControl('project', formBuilder.control('', [Validators.required]));
    this.formGroup.addControl('task', formBuilder.control('', [Validators.required]));
    combineLatest([activatedRoute.params, store.select(selectAccounting)]).subscribe({
      next: ([params, acc]) => {
        const p = params as RecordEditRouteParams;
        this.recordingIndex = Number.parseInt(p.index);
        this.year = Number.parseInt(p.year);
        this.month = Number.parseInt(p.month);
        this.day = Number.parseInt(p.day);
        const day = acc.months.find(m => m.year === this.year && m.month === this.month)?.days.find(d => d.day === this.day);
        if (day != undefined) {
          this.records = day.records.slice(0);
          const record = day.records[this.recordingIndex];
          if (record != undefined) {
            this.hasEnd = record?.endTime != undefined;
            const v = this.value;
            this.startDate = new Date(record.startTime);
            const endDate = record.endTime == undefined ? undefined : new Date(record.endTime);
            v.endHour = endDate?.getHours() ?? 0;
            v.endMinute = endDate?.getMinutes() ?? 0;
            v.project = record.project;
            v.startHour = this.startDate.getHours();
            v.startMinute = this.startDate.getMinutes();
            v.task = record.task;
            this.value = v;
          }
        }
      }
    });
  }

  alignBackwards() {
    const prev = new Date(this.records[this.recordingIndex - 1].endTime!);
    const v = this.value;
    v.startHour = prev.getHours();
    v.startMinute = prev.getMinutes();
    this.value = v;
  }

  alignForwards() {
    const next = new Date(this.records[this.recordingIndex + 1].startTime);
    const v = this.value;
    v.endHour = next.getHours();
    v.endMinute = next.getMinutes();
    this.value = v;
  }

  navigateToParent() {
    if (this.router.url.startsWith('/day/')) {
      this.router.navigate(['day']);
    } else if (this.router.url.startsWith('/month/')) {
      this.router.navigate(['month', this.year, this.month, this.day, 'edit']);
    }
  }

  save() {
    const v = this.value;
    const start = new Date(this.startDate.getTime());
    start.setHours(v.startHour);
    start.setMinutes(v.startMinute);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = this.hasEnd ? new Date(start.getTime()) : undefined;
    if (end != undefined) {
      end.setHours(v.endHour);
      end.setMinutes(v.endMinute);
      if (end.getTime() < start.getTime()) {
        end.setTime(end.getTime() + 24 * 3600_000);
      }
    }
    this.accountingService.setRecord(this.year, this.month, this.day, this.recordingIndex, v.project, v.task, start.getTime(), end?.getTime())
      .subscribe({
        next: result => {
          if (result) {
            this.navigateToParent();
          }
        }
      });
  }
}
