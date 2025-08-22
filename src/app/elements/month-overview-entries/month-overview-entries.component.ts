import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges, inject, input } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { MessageBoxService } from '../../service/message-box.service';
import { HoursPipe } from "../hours.pipe";
import { DurationPipe } from '../duration.pipe';
import { AccountingService } from '../../service/accounting.service';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subject } from 'rxjs';
import { selectAccounting } from '../../selector/accounting-selectors';
import { DayState } from '../../state/day-state';

interface Item {
  readonly day: number;
  readonly date: Date;
  readonly accounted: boolean;
  readonly workedHours: number;
  readonly absence: boolean;
  readonly complete: boolean;
  readonly future: boolean;
}

@Component({
  selector: 'tiu-month-overview-entries',
  imports: [NgClass, DatePipe, AsyncPipe, DurationPipe, HoursPipe],
  templateUrl: './month-overview-entries.component.html',
  styleUrl: './month-overview-entries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthOverviewEntriesComponent implements OnChanges {

  readonly year = input.required<number>();
  readonly month = input.required<number>();
  readonly items$: Observable<Item[]>;

  private readonly accountingService = inject(AccountingService);
  private readonly router = inject(Router);
  private readonly messageBoxService = inject(MessageBoxService);
  private readonly selectedMonth$ = new Subject<{ year: number, month: number }>();

  constructor() {
    const store = inject(Store);

    // TODO this needs to be overworked
    this.items$ = combineLatest([this.selectedMonth$, store.select(selectAccounting)]).pipe(
      map(([sel, acc]) => acc.months.find(m => m.year === sel.year && m.month === sel.month)?.days ?? []),
      map(days => this.daysToItems(days))
    );
  }

  ngOnChanges(_: SimpleChanges) {
    window.setTimeout(() => this.selectedMonth$.next({ year: this.year(), month: this.month() }), 1);
  }

  edit(day: number) {
    this.router.navigate(['month', this.year(), this.month(), day, 'edit']);
  }

  setAbsence(day: number) {
    this.accountingService.setDayAbsence(this.year(), this.month(), day, 1).subscribe({ next: _ => { } });
  }

  remove(day: number) {
    const date = new Date();
    date.setTime(0);
    date.setFullYear(this.year());
    date.setMonth(this.month());
    date.setDate(day);
    this.messageBoxService.question(`Do you want to delete all recordings for ${date.toLocaleDateString()}?`).subscribe({
      next: result => {
        if (result) {
          this.accountingService.deleteDay(this.year(), this.month(), day).subscribe({ next: _ => { } });
        }
      }
    });
  }

  view(day: number) {
    this.router.navigate(['month', this.year(), this.month(), day, 'view']);
  }

  private daysToItems(days: DayState[]): Item[] {
    return days.map(d => {
      const date = new Date();
      date.setTime(0);
      date.setFullYear(this.year());
      date.setMonth(this.month());
      date.setDate(d.day);
      const ret: Item = {
        accounted: d.accounted,
        complete: !d.active,
        date,
        day: d.day,
        absence: d.absence > 0,
        workedHours: d.workedHours,
        future: d.future
      };
      return ret;
    });
  }
}
