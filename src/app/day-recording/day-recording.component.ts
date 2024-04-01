import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { SelectProjectComponent } from "../elements/select-project/select-project.component";
import { SelectTaskComponent } from "../elements/select-task/select-task.component";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelService } from '../model.service';
import { DayEntriesComponent } from "../day-entries/day-entries.component";
import { ButtonErrorDirective } from '../elements/button-error.directive';
import { RouterModule } from '@angular/router';
import { HoursPipe } from "../elements/hours.pipe";
import { HelpButtonDirective } from '../elements/help-button.directive';
import { DurationPipe } from '../elements/duration.pipe';

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
  imports: [CommonModule, MenuComponent, SelectProjectComponent, SelectTaskComponent, ReactiveFormsModule, DayEntriesComponent, ButtonErrorDirective, RouterModule, DurationPipe, HoursPipe, HelpButtonDirective]
})
export class DayRecordingComponent implements OnDestroy {

  readonly formGroup: FormGroup;

  workingHours = 0;
  pauseHours = 0;
  year = 0;
  month = 0;
  day = 0;

  private timer: number;

  get canSaveComment(): boolean {
    return this.formGroup.controls['comment'].dirty;
  }

  get canStart(): boolean {
    return this.formGroup.valid;
  }

  get canStop(): boolean {
    return this.modelService.isRecording;
  }

  get isRecording(): boolean {
    return this.modelService.isRecording;
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

  constructor(private readonly modelService: ModelService, formBuilder: FormBuilder, changeDetectorRef: ChangeDetectorRef) {
    this.formGroup = formBuilder.group({});
    const proj = this.modelService.favoriteProject ?? '';
    const task = proj === '' ? '' : this.modelService.getFavoriteTask(proj);
    this.formGroup.addControl('project', formBuilder.control(proj, [Validators.required]));
    this.formGroup.addControl('task', formBuilder.control(task, [Validators.required]));
    this.formGroup.addControl('comment', formBuilder.control(this.modelService.comment, []));
    this.timer = setInterval(() => {
      this.update();
      changeDetectorRef.markForCheck();
    }, 500);
    this.update();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  start() {
    this.modelService.startTask(this.value.project, this.value.task);
    this.update();
  }

  stop() {
    this.modelService.stop();
    this.update();
  }

  saveComment() {
    this.modelService.comment = this.value.comment;
    this.formGroup.controls['comment'].markAsPristine();
  }

  private update() {
    const day = this.modelService.activeDay;
    this.year = day.year;
    this.month = day.month;
    this.day = day.day;
    const recordings = this.modelService.getDayAggregatedRecordings(this.year, this.month, this.day);
    if (recordings != undefined) {
      this.workingHours = recordings.totalWorkingHours;
      this.pauseHours = recordings.totalPauseHours;
    } else {
      this.workingHours = 0;
      this.pauseHours = 0;
    }
  }
}
