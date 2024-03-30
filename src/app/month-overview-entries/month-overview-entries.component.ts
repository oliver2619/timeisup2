import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModelService} from '../model.service';
import {Router} from '@angular/router';
import {MessageBoxService} from '../message-box.service';
import {HoursPipe} from "../elements/hours.pipe";
import { DurationPipe } from '../elements/duration.pipe';

interface Item {
  readonly day: number;
  readonly date: Date;
  readonly booked: boolean;
  readonly workedHours: number;
  readonly holiday: boolean;
  readonly complete: boolean;
}

@Component({
  selector: 'tiu-month-overview-entries',
  standalone: true,
  imports: [CommonModule, DurationPipe, HoursPipe],
  templateUrl: './month-overview-entries.component.html',
  styleUrl: './month-overview-entries.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MonthOverviewEntriesComponent implements OnChanges {

  @Input('year')
  year: number | undefined;

  @Input('month')
  month: number | undefined;

  items: Item[] = [];

  constructor(private readonly modelService: ModelService, private readonly router: Router, private readonly messageBoxService: MessageBoxService) {
  }

  ngOnChanges(_: SimpleChanges): void {
    this.update();
  }

  edit(day: number) {
    this.router.navigate(['month', this.year!, this.month!, day, 'edit']);
  }

  setHoliday(day: number) {
    this.modelService.setDayHoliday(this.year!, this.month!, day, 1);
    this.update();
  }

  remove(day: number) {
    const date = new Date();
    date.setTime(0);
    date.setFullYear(this.year!);
    date.setMonth(this.month!);
    date.setDate(day);
    this.messageBoxService.question(`Do you want to delete all recordings for ${date.toLocaleDateString()}?`).subscribe({
      next: result => {
        if (result) {
          this.modelService.removeDayRecords(this.year!, this.month!, day);
          this.update();
        }
      }
    });
  }

  view(day: number) {
    this.router.navigate(['month', this.year!, this.month!, day, 'view']);
  }

  private update() {
    if (this.year == undefined || this.month == undefined) {
      this.items = [];
      return;
    }
    const booked = this.modelService.getRecordedDays(this.year, this.month).map(it => {
      const date = new Date();
      date.setTime(0);
      date.setFullYear(this.year!);
      date.setMonth(this.month!);
      date.setDate(it);      
      const ret: Item = {
        date,
        day: it,
        booked: true,
        workedHours: this.modelService.getWorkedHours(this.year!, this.month!, it),
        holiday: this.modelService.getDayHoliday(this.year!, this.month!, it) > 0,
        complete: this.modelService.isDayComplete(this.year!, this.month!, it)
      };
      return ret;
    });
    const unbooked = this.modelService.getUnrecordedDays(this.year, this.month).map(it => {
      const date = new Date();
      date.setTime(0);
      date.setFullYear(this.year!);
      date.setMonth(this.month!);
      date.setDate(it);
      const ret: Item = {
        date,
        day: it,
        booked: false,
        workedHours: 0,
        holiday: false,
        complete: false
      };
      return ret;
    });
    this.items = [...booked, ...unbooked];
    this.items.sort((e1, e2) => e1.day - e2.day);
  }
}
