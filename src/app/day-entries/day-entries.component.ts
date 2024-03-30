import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelService } from '../model.service';
import { Router } from '@angular/router';
import { MessageBoxService } from '../message-box.service';
import { HoursPipe } from "../elements/hours.pipe";
import { DayRecordingContextMenuComponent } from '../day-recording-context-menu/day-recording-context-menu.component';
import { DayRecordingContextMenu } from '../day-recording-context-menu/day-recording-context-menu';
import { DurationPipe } from '../elements/duration.pipe';

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
  selector: 'tiu-day-entries',
  standalone: true,
  imports: [CommonModule, HoursPipe, DurationPipe, DayRecordingContextMenuComponent],
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

  @ViewChild(DayRecordingContextMenuComponent)
  dayRecordingContextMenu: DayRecordingContextMenu | undefined;

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
    if (url == '/day') {
      this.router.navigate(['day', this.year!, this.month!, this.day!, index]);
    } else if (url.startsWith('/month/')) {
      this.router.navigate(['month', this.year!, this.month!, this.day!, 'edit', index]);
    }
  }

  showContextMenu(index: number) {
    this.dayRecordingContextMenu?.show(this.year!, this.month!, this.day!, index);
  }

  private updateItems() {
    if (this.year != undefined && this.month != undefined && this.day != undefined) {
      this.items = this.modelService.getDayRecords(this.year, this.month, this.day).map((it, index) => {
        const end = it.end != undefined ? it.end : new Date();
        const ret: Item = {
          start: it.start,
          end,
          project: it.project,
          task: it.task,
          durationHours: (end.getTime() - it.start.getTime()) / 3600_000,
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
