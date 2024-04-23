import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../elements/menu/menu.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DayRouteParams } from '../../day-route-params';
import { HoursPipe } from "../../elements/hours.pipe";
import { DurationPipe } from '../../elements/duration.pipe';
import { TimePipe } from '../../elements/time.pipe';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { selectAccounting } from '../../selector/accounting-selectors';
import { DayState } from '../../state/day-state';
import { MonthState } from '../../state/month-state';
import { selectHoursPerDay } from '../../selector/settings-selectors';

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
  selector: 'tiu-day-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent, DurationPipe, HoursPipe, TimePipe],
  templateUrl: './day-overview.component.html',
  styleUrl: './day-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayOverviewComponent {

  readonly date = signal(new Date());
  readonly start: WritableSignal<Date | undefined> = signal(undefined);
  readonly end: WritableSignal<Date | undefined> = signal(undefined);
  readonly absence = signal(0);
  readonly comment = signal('');
  readonly totalWorkingHours = signal(0);
  readonly totalPauseHours = signal(0);
  readonly hasComment = computed(() => this.comment().length > 0);
  readonly absenceHours = computed(() => this.absence() * this.hoursPerDay());
  readonly totalHours = computed(() => this.totalWorkingHours() + this.absenceHours());
  readonly hasWorked = computed(() => this.start() != undefined);
  readonly projects: WritableSignal<ProjectRecording[]> = signal([]);
  readonly hasPrevious = computed(() => this.allDaysOfMonth().some(it => it < this.date().getDate()));
  readonly hasNext = computed(() => this.allDaysOfMonth().some(it => it > this.date().getDate()));

  private readonly hoursPerDay = signal(0);
  private readonly allDaysOfMonth = signal<number[]>([]);

  constructor(private router: Router, store: Store, activatedRoute: ActivatedRoute) {
    store.select(selectHoursPerDay).subscribe({ next: h => this.hoursPerDay.set(h) });
    combineLatest([activatedRoute.params as Observable<DayRouteParams>, store.select(selectAccounting)]).pipe(
      map(([route, acc]) => {
        const year = Number.parseInt(route.year);
        const month = Number.parseInt(route.month);
        const monthState = acc.months.find(m => m.year === year && m.month === month);
        return monthState?.days.map(d => d.day) ?? [];
      })
    ).subscribe({ next: days => this.allDaysOfMonth.set(days) });
    const day$ = combineLatest([activatedRoute.params as Observable<DayRouteParams>, store.select(selectAccounting)]).pipe(
      map(([route, acc]) => {
        const year = Number.parseInt(route.year);
        const month = Number.parseInt(route.month);
        const day = Number.parseInt(route.day);
        const monthState = acc.months.find(m => m.year === year && m.month === month);
        return [monthState, monthState?.days.find(d => d.day === day), acc.currentTime]
      }),
      filter(([m, d]) => m != undefined && d != undefined)
    ) as Observable<[MonthState, DayState, number]>;
    day$.subscribe({
      next: ([month, day, time]) => this.update(month, day, time)
    });
  }

  previous() {
    const days = this.allDaysOfMonth().filter(it => it < this.date().getDate()).sort((d1, d2) => d1 - d2);
    this.router.navigate(['month', this.date().getFullYear(), this.date().getMonth(), days[days.length - 1], 'view']);
  }

  next() {
    const days = this.allDaysOfMonth().filter(it => it > this.date().getDate()).sort((d1, d2) => d1 - d2);
    this.router.navigate(['month', this.date().getFullYear(), this.date().getMonth(), days[0], 'view']);
  }

  private update(month: MonthState, day: DayState, currentTime: number) {
    this.absence.set(day.absence);
    this.comment.set(day.comment);
    this.totalWorkingHours.set(day.workedHours);
    this.totalPauseHours.set(day.pausedHours);
    const date = new Date();
    date.setTime(0);
    date.setFullYear(month.year);
    date.setMonth(month.month);
    date.setDate(day.day);
    this.date.set(date);
    const records = day.records.slice(0);
    records.sort((r1, r2) => r1.startTime - r2.startTime);
    if (records.length > 0) {
      const start = new Date();
      start.setTime(records[0].startTime);
      this.start.set(start);
      const end = new Date();
      const er = records[records.length - 1];
      end.setTime(er.endTime == undefined ? currentTime : er.endTime);
      this.end.set(end);
    } else {
      this.start.set(undefined);
      this.end.set(undefined);
    }
    this.projects.set(this.getProjectRecording(day));
  }

  private getProjectRecording(day: DayState): ProjectRecording[] {
    const map = new Map<string, ProjectRecording>();
    day.records.forEach(record => {
      const cur = map.get(record.project);
      const next: ProjectRecording = {
        project: record.project,
        tasks: cur == undefined ? [] : cur.tasks,
        totalHours: cur == undefined ? record.hours : (cur.totalHours + record.hours)
      };
      map.set(record.project, next);
      const ta = next.tasks.findIndex(t => t.task === record.task);
      if (ta >= 0) {
        const t = next.tasks[ta];
        next.tasks.splice(ta, 1, { task: record.task, totalHours: t.totalHours + record.hours });
      } else {
        next.tasks.push({ task: record.task, totalHours: record.hours });
      }
    });
    const ret = Array.from(map.values());
    ret.sort((p1, p2) => p1.project.localeCompare(p2.project));
    ret.forEach(p => p.tasks.sort((t1, t2) => t1.task.localeCompare(t2.task)));
    return ret;
  }
}
