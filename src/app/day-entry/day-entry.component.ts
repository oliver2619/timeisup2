import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModelService } from '../model.service';
import { SelectProjectComponent } from "../elements/select-project/select-project.component";
import { SelectTaskComponent } from "../elements/select-task/select-task.component";
import { TimeEditComponent } from "../elements/time-edit/time-edit.component";
import { HoursPipe } from "../elements/hours.pipe";
import { HelpButtonDirective } from '../elements/help-button.directive';
import { DurationPipe } from '../elements/duration.pipe';

export interface DayEntryRouteParams {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly index: string;
}

interface DayEntryFormValue {
  startHour: number;
  endHour: number;
  startMinute: number;
  endMinute: number;
  project: string;
  task: string;
}

@Component({
  selector: 'tiu-day-entry',
  standalone: true,
  templateUrl: './day-entry.component.html',
  styleUrl: './day-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MenuComponent, SelectProjectComponent, SelectTaskComponent, HoursPipe, DurationPipe, TimeEditComponent, HelpButtonDirective]
})
export class DayEntryComponent {

  readonly formGroup: FormGroup;

  hasEnd = true;

  private recordingIndex = 0;
  private year = 0;
  private month = 0;
  private day = 0;

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

  get canAlignBackwards(): boolean {
    return this.recordingIndex > 0;
  }

  get canAlignForwards(): boolean {
    return this.recordingIndex < this.modelService.getDayRecords(this.year, this.month, this.day).length - 1;
  }

  get canSave(): boolean {
    return this.formGroup.valid;
  }

  get durationHours(): number {
    if (this.hasEnd) {
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

  private get value(): DayEntryFormValue {
    return this.formGroup.value as DayEntryFormValue;
  }

  private set value(v: DayEntryFormValue) {
    this.formGroup.setValue(v);
  }

  constructor(private readonly modelService: ModelService, private readonly router: Router, formBuilder: FormBuilder, activatedRoute: ActivatedRoute) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('startHour', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(23)]));
    this.formGroup.addControl('endHour', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(23)]));
    this.formGroup.addControl('startMinute', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(59)]));
    this.formGroup.addControl('endMinute', formBuilder.control(0, [Validators.required, Validators.min(0), Validators.max(59)]));
    this.formGroup.addControl('project', formBuilder.control('', [Validators.required]));
    this.formGroup.addControl('task', formBuilder.control('', [Validators.required]));
    activatedRoute.params.subscribe({
      next: params => {
        const p = params as DayEntryRouteParams;
        this.recordingIndex = Number.parseInt(p.index);
        this.year = Number.parseInt(p.year);
        this.month = Number.parseInt(p.month);
        this.day = Number.parseInt(p.day);
        const record = this.modelService.getDayRecords(this.year, this.month, this.day)[this.recordingIndex];
        this.hasEnd = record.end != undefined;
        const v = this.value;
        v.endHour = record.end?.getHours() ?? 0;
        v.endMinute = record.end?.getMinutes() ?? 0;
        v.project = record.project;
        v.startHour = record.start.getHours();
        v.startMinute = record.start.getMinutes();
        v.task = record.task;
        this.value = v;
      }
    });
  }

  alignBackwards() {
    const v = this.value;
    const prev = this.modelService.getDayRecords(this.year, this.month, this.day)[this.recordingIndex - 1];
    v.startHour = prev.end!.getHours();
    v.startMinute = prev.end!.getMinutes();
    this.value = v;
  }

  alignForwards() {
    const v = this.value;
    const prev = this.modelService.getDayRecords(this.year, this.month, this.day)[this.recordingIndex + 1];
    v.endHour = prev.start.getHours();
    v.endMinute = prev.start.getMinutes();
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
    const start = new Date();
    start.setTime(this.modelService.getDayRecords(this.year, this.month, this.day)[0].start.getTime());
    start.setHours(v.startHour);
    start.setMinutes(v.startMinute);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = this.hasEnd ? new Date() : undefined;
    if (end != undefined) {
      end.setTime(start.getTime());
      end.setHours(v.endHour);
      end.setMinutes(v.endMinute);
      if (end.getTime() < start.getTime()) {
        end.setTime(end.getTime() + 24 * 3600_000);
      }
    }
    this.modelService.setDayRecord(this.year, this.month, this.day, this.recordingIndex, start, end, v.project, v.task);
    this.navigateToParent();
  }
}
