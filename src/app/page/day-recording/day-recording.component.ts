import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { SelectProjectComponent } from "../../elements/select-project/select-project.component";
import { SelectTaskComponent } from "../../elements/select-task/select-task.component";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RecordListComponent } from "../../elements/record-list/record-list.component";
import { ButtonErrorDirective } from '../../elements/button-error.directive';
import { RouterModule } from '@angular/router';
import { HoursPipe } from "../../elements/hours.pipe";
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { DurationPipe } from '../../elements/duration.pipe';
import { Store } from '@ngrx/store';
import { selectProjectSettings } from '../../selector/project-settings-selectors';
import { AccountingService } from '../../service/accounting.service';
import { selectCurrentComment, selectCurrentDate, selectCurrentDay, selectCurrentTask } from '../../selector/accounting-selectors';

interface DayRecordingFormValue {
  project: string;
  task: string;
  comment: string;
}

@Component({
  selector: 'tiu-day-recording',
  standalone: true,
  templateUrl: './day-recording.component.html',
  styleUrl: './day-recording.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MenuComponent, SelectProjectComponent, SelectTaskComponent, ReactiveFormsModule, RecordListComponent, ButtonErrorDirective, RouterModule, DurationPipe, HoursPipe, HelpButtonDirective]
})
export class DayRecordingComponent {

  readonly formGroup: FormGroup;
  readonly workingHours = signal(0);
  readonly pauseHours = signal(0);
  readonly year = signal(0);
  readonly month = signal(0);
  readonly day = signal(0);
  readonly isRecording = signal(false);

  get canSaveComment(): boolean {
    return this.formGroup.controls['comment'].dirty;
  }

  get canStart(): boolean {
    return this.formGroup.valid;
  }

  get projectControl(): FormControl<string> {
    return this.formGroup.controls['project'] as FormControl<string>;
  }

  get taskControl(): FormControl<string> {
    return this.formGroup.controls['task'] as FormControl<string>;
  }

  private get value(): DayRecordingFormValue {
    return this.formGroup.value as DayRecordingFormValue;
  }

  constructor(private readonly accountingService: AccountingService, store: Store, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('project', formBuilder.control('', [Validators.required]));
    this.formGroup.addControl('task', formBuilder.control('', [Validators.required]));
    this.formGroup.addControl('comment', formBuilder.control('', []));
    store.select(selectProjectSettings).subscribe({
      next: settings => {
        if (settings.favoriteProject != undefined) {
          this.projectControl.setValue(settings.favoriteProject);
          const task = settings.projects[settings.favoriteProject].favoriteTask;
          if (task != undefined) {
            this.taskControl.setValue(task);
          }
        }
      }
    });
    store.select(selectCurrentTask).subscribe({
      next: task => this.isRecording.set(task != undefined)
    });
    store.select(selectCurrentDate).subscribe({
      next: date => {
        if (date != undefined) {
          this.day.set(date.day);
          this.month.set(date.month);
          this.year.set(date.year);
        } else {
          const now = new Date();
          this.day.set(now.getDate());
          this.month.set(now.getMonth());
          this.year.set(now.getFullYear());
        }
      }
    });
    store.select(selectCurrentDay).subscribe({
      next: day => {
        if (day != undefined) {
          this.workingHours.set(day.workedHours);
          this.pauseHours.set(day.pausedHours);
        } else {
          this.workingHours.set(0);
          this.pauseHours.set(0);
        }
      }
    });
    store.select(selectCurrentComment).subscribe({
      next: comment => {
        const v = this.value;
        v.comment = comment;
        this.formGroup.setValue(v);
      }
    });
  }

  start() {
    this.accountingService.startRecording(this.value.project, this.value.task).subscribe({ next: _ => { } });
  }

  stop() {
    this.accountingService.stopRecording().subscribe({ next: _ => { } });
  }

  saveComment() {
    this.accountingService.setCommentToCurrentDay(this.value.comment).subscribe({
      next: result => {
        if (result) {
          this.formGroup.controls['comment'].markAsPristine();
        }
      }
    });
  }
}
