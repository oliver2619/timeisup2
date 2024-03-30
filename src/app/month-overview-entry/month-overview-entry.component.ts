import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DayRouteParams } from '../day-route-params';
import { ModelService } from '../model.service';
import { AggregatedProjectRecordings } from '../../model/aggregated-recordings';
import { HoursPipe } from "../elements/hours.pipe";
import { DurationPipe } from '../elements/duration.pipe';

interface TaskRecording {
  task: string;
  readonly totalHours: number;
}

interface ProjectRecording {
  readonly project: string;
  readonly totalHours: number;
  readonly tasks: TaskRecording[];
}

@Component({
  selector: 'tiu-month-overview-entry',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, DurationPipe, HoursPipe],
  templateUrl: './month-overview-entry.component.html',
  styleUrl: './month-overview-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MonthOverviewEntryComponent {

  date = new Date();
  start: Date | undefined;
  end: Date | undefined;
  comment = '';
  totalWorkingHours = 0;
  totalPauseHours = 0;
  projects: ProjectRecording[] = [];
  absence = 0;

  get hasComment(): boolean {
    return this.comment.length > 0;
  }

  get hasPrevious(): boolean {
    return this.allDaysOfMonth.some(it => it < this.date.getDate());
  }

  get hasWorked(): boolean {
    return this.start != undefined;
  }

  get hasNext(): boolean {
    return this.allDaysOfMonth.some(it => it > this.date.getDate());
  }

  get absenceHours(): number {
    return this.absence * this.modelService.hoursPerDay;
  }

  get totalHours(): number {
    return this.totalWorkingHours + this.absenceHours;
  }

  private get allDaysOfMonth(): number[] {
    return this.modelService.getRecordedDays(this.date.getFullYear(), this.date.getMonth());
  }

  constructor(private modelService: ModelService, private router: Router, activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe({
      next: params => {
        const date: DayRouteParams = params as DayRouteParams;
        this.update(Number.parseInt(date.year), Number.parseInt(date.month), Number.parseInt(date.day));
      }
    });
  }

  previous() {
    const days = this.allDaysOfMonth.filter(it => it < this.date.getDate()).sort((d1, d2) => d1 - d2);
    this.router.navigate(['month', this.date.getFullYear(), this.date.getMonth(), days[days.length - 1], 'view']);
  }

  next() {
    const days = this.allDaysOfMonth.filter(it => it > this.date.getDate()).sort((d1, d2) => d1 - d2);
    this.router.navigate(['month', this.date.getFullYear(), this.date.getMonth(), days[0], 'view']);
  }

  private update(year: number, month: number, day: number) {
    this.date = new Date();
    this.date.setTime(0);
    this.date.setFullYear(year);
    this.date.setMonth(month);
    this.date.setDate(day);
    this.absence = this.modelService.getDayHoliday(year, month, day);
    const recordings = this.modelService.getDayAggregatedRecordings(year, month, day);
    if (recordings != undefined) {
      this.start = new Date();
      this.start.setTime(recordings.start.getTime());
      this.end = new Date();
      this.end.setTime(recordings.end.getTime());
      this.comment = recordings.comment;
      this.totalWorkingHours = recordings.totalWorkingHours
      this.totalPauseHours = recordings.totalPauseHours;
      this.projects = this.hoursByProjectAndTaskToProjectRecordings(recordings.hoursByProjectAndTask);
    } else {
      this.start = undefined;
      this.end = undefined;
      this.comment = this.modelService.getDayComment(year, month, day);
      this.totalWorkingHours = 0;
      this.totalPauseHours = 0;
      this.projects = [];
    }
  }

  private hoursByProjectAndTaskToProjectRecordings(input: {
    [key: string]: AggregatedProjectRecordings
  }): ProjectRecording[] {
    return Object.entries(input).map(it => {
      const ret: ProjectRecording = {
        project: it[0],
        totalHours: it[1].totalWorkingHours,
        tasks: this.workingHoursByTasksToTaskRecordings(it[1].workingHoursByTask)
      };
      return ret;
    });
  }

  private workingHoursByTasksToTaskRecordings(input: { [key: string]: number }): TaskRecording[] {
    return Object.entries(input).map(ta => {
      const ret: TaskRecording = {
        task: ta[0],
        totalHours: ta[1]
      };
      return ret;
    });
  }
}
