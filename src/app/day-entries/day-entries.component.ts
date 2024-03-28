import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../model.service';
import { Router } from '@angular/router';
import { MessageBoxService } from '../message-box.service';
import {TimePipe} from "../elements/time.pipe";
import {HoursPipe} from "../elements/hours.pipe";

interface Item {
  readonly project: string;
  readonly task: string;
  readonly start: Date;
  readonly end: Date;
  readonly durationHours: number;
  readonly durationTime: Date;
  readonly index: number;
  readonly isActive: boolean;
  startValid: boolean;
  endValid: boolean;
  durationValid: boolean;
  valid: boolean;
}

@Component({
  selector: 'tiu-day-entries',
  standalone: true,
  imports: [CommonModule, TimePipe, HoursPipe],
  templateUrl: './day-entries.component.html',
  styleUrl: './day-entries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayEntriesComponent implements OnChanges, OnDestroy {

  @Input()
  year: number | undefined;

  @Input()
  month: number | undefined;

  @Input()
  day: number | undefined;

  items: Item[] = [];

  private timer: number;

  constructor(private readonly modelService: ModelService, private readonly router: Router, private readonly messageBoxService: MessageBoxService, private readonly changeDetectorRef: ChangeDetectorRef) {
    this.updateItems();
    this.timer = setInterval(() => {
      this.updateItems();
      changeDetectorRef.markForCheck();
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateItems();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  edit(index: number) {
    const url = this.router.url;
    if(url == '/day') {
      this.router.navigate(['day', this.year!, this.month!, this.day!, index]);
    }else if(url.startsWith('/month/')) {
      this.router.navigate(['month', this.year!, this.month!, this.day!, 'edit', index]);
    }
}

  remove(index: number) {
    this.messageBoxService.question('Do you want to remove this record?').subscribe({
      next: result => {
        if(result) {
          this.modelService.removeDayRecord(this.year!, this.month!, this.day!, index);
          this.updateItems();
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }

  private updateItems() {
    if (this.year != undefined && this.month != undefined && this.day != undefined) {
      this.items = this.modelService.getDayRecords(this.year, this.month, this.day).map((it, index) => {
        const end = it.end != undefined ? it.end : new Date();
        const durationHours = (end.getTime() - it.start.getTime()) / 3600_000;
        const durationTime = new Date();
        durationTime.setTime(end.getTime() - it.start.getTime());
        const ret: Item = {
          start: it.start,
          end,
          project: it.project,
          task: it.task,
          durationHours,
          durationTime,
          index,
          startValid: true,
          endValid: true,
          durationValid: true,
          valid: true,
          isActive: it.end == undefined
        };
        return ret;
      }).sort((i1, i2) => i1.start.getTime() - i2.start.getTime());
    } else {
      this.items = [];
    }
    this.items.forEach((it, i, items) => {
      it.startValid = i === 0 || items[i - 1].end.getTime() <= it.start.getTime();
      it.endValid = i === items.length - 1 || items[i + 1].start.getTime() >= it.end.getTime();
      it.durationValid = it.end.getTime() >= it.start.getTime();
      it.valid = it.startValid && it.endValid && it.durationValid;
    });
  }
}
