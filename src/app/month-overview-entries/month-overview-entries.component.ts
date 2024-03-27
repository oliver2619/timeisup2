import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModelService} from '../model.service';
import {Router} from '@angular/router';
import {MessageBoxService} from '../message-box.service';
import {HoursPipe} from "../elements/hours.pipe";
import {TimePipe} from "../elements/time.pipe";

interface Item {
  readonly day: number;
  readonly date: Date;
  readonly worked: boolean;
  readonly workedHours: number;
  readonly workedTime: Date;
  readonly holiday: boolean;
}

@Component({
  selector: 'tiu-month-overview-entries',
  standalone: true,
  imports: [CommonModule, TimePipe, HoursPipe],
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
    this.edit(day);
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
      const workedHours = this.modelService.getWorkedHours(this.year!, this.month!, it);
      const workedTime = new Date();
      workedTime.setTime(workedHours * 3600_000);
      const ret: Item = {
        date,
        day: it,
        worked: true,
        workedHours,
        workedTime,
        holiday: this.modelService.getDayHoliday(this.year!, this.month!, it) > 0
      };
      return ret;
    });
    const unbooked = this.modelService.getUnrecordedDays(this.year, this.month).map(it => {
      const date = new Date();
      date.setTime(0);
      date.setFullYear(this.year!);
      date.setMonth(this.month!);
      date.setDate(it);
      const workedTime = new Date();
      workedTime.setTime(0);
      const ret: Item = {
        date,
        day: it,
        worked: false,
        workedHours: 0,
        workedTime,
        holiday: false
      };
      return ret;
    });
    this.items = [...booked, ...unbooked];
    this.items.sort((e1, e2) => e1.day - e2.day);
  }
}
