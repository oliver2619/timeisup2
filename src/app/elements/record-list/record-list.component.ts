import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HoursPipe } from "../hours.pipe";
import { RecordListContextMenuComponent } from '../record-list-context-menu/record-list-context-menu.component';
import { RecordListContextMenu } from '../record-list-context-menu/record-list-context-menu';
import { DurationPipe } from '../duration.pipe';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, Subject } from 'rxjs';
import { DateState } from '../../state/date-state';
import { selectAccounting } from '../../selector/accounting-selectors';
import { DayState } from '../../state/day-state';
import { TimePipe } from '../time.pipe';

interface Item {
  readonly project: string;
  readonly task: string;
  readonly start: Date;
  readonly end: Date;
  readonly durationHours: number;
  readonly index: number;
  readonly isActive: boolean;
  startValid: boolean;
  endValid: boolean;
  durationValid: boolean;
  valid: boolean;
}

@Component({
  selector: 'tiu-record-list',
  standalone: true,
  imports: [CommonModule, HoursPipe, DurationPipe, RecordListContextMenuComponent, TimePipe],
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordListComponent implements OnChanges {

  @Input()
  year: number = 0;

  @Input()
  month: number = 0;

  @Input()
  day: number = 0;

  @ViewChild(RecordListContextMenuComponent)
  dayRecordingContextMenu: RecordListContextMenu | undefined;

  readonly items$: Observable<Item[]>;

  private readonly date = new Subject<DateState>();

  constructor(private readonly router: Router, store: Store) {
    this.items$ = combineLatest([this.date, store.select(selectAccounting)]).pipe(
      map(([date, accounting]) => ({
        day: accounting.months.find(m => m.year === date.year && m.month === date.month)?.days.find(d => d.day === date.day),
        currentTime: accounting.currentTime
      })),
      filter(it => it.day != undefined),
      map(it => this.dayToItems(it.day as DayState, it.currentTime))
    );
  }

  ngOnChanges(_: SimpleChanges) {
    window.setTimeout(() => this.date.next({ day: this.day, month: this.month, year: this.year }), 1);
  }

  edit(index: number) {
    const url = this.router.url;
    if (url == '/day') {
      this.router.navigate(['day', this.year!, this.month!, this.day!, index]);
    } else if (url.startsWith('/month/')) {
      this.router.navigate(['month', this.year!, this.month!, this.day!, 'edit', index]);
    }
  }

  showContextMenu(index: number) {
    this.dayRecordingContextMenu?.show(this.year!, this.month!, this.day!, index);
  }

  private dayToItems(day: DayState, currentTime: number): Item[] {
    const ret = day.records.map((r, i) => {
      const start = new Date();
      start.setTime(r.startTime);
      const end = new Date();
      if (r.endTime != undefined) {
        end.setTime(r.endTime);
      } else {
        end.setTime(currentTime);
      }
      const ret: Item = {
        durationHours: r.hours,
        durationValid: true,
        end,
        endValid: true,
        index: i,
        isActive: r.endTime == undefined,
        project: r.project,
        start,
        startValid: true,
        task: r.task,
        valid: true
      };
      return ret;
    });
    ret.sort((r1, r2) => r1.start.getTime() - r2.start.getTime());
    ret.forEach((it, i, items) => {
      it.startValid = i === 0 || items[i - 1].end.getTime() <= it.start.getTime();
      it.endValid = i === items.length - 1 || items[i + 1].start.getTime() >= it.end.getTime();
      it.durationValid = it.end.getTime() >= it.start.getTime();
      it.valid = it.startValid && it.endValid && it.durationValid;
    });
    return ret;
  }
}
