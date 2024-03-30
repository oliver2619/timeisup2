import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayRecordingContextMenu } from './day-recording-context-menu';
import { MessageBoxService } from '../message-box.service';
import { ModelService } from '../model.service';

@Component({
  selector: 'tiu-day-recording-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-recording-context-menu.component.html',
  styleUrl: './day-recording-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DayRecordingContextMenuComponent implements DayRecordingContextMenu {

  canJoinWithPrevious: boolean = false;

  private year: number | undefined;
  private month: number | undefined;
  private day: number | undefined;
  private recordingIndex: number | undefined;

  private set visible(v: boolean) {
    if (v) {
      this.element.nativeElement.classList.add('visible');
    } else {
      this.element.nativeElement.classList.remove('visible');
    }
  }

  constructor(private readonly element: ElementRef<HTMLElement>, private readonly messageBoxService: MessageBoxService, private readonly modelService: ModelService) { }

  hide() {
    this.visible = false;
  }

  joinWithPrevious() {
    this.messageBoxService.question('Do you want to join the two records and truncate the break between?').subscribe({
      next: result => {
        if (result) {
          this.modelService.joinDayRecordWithPrevious(this.year!, this.month!, this.day!, this.recordingIndex!);
          this.hide();
        }
      }
    });
  }

  remove() {
    this.messageBoxService.question('Do you want to remove this record?').subscribe({
      next: result => {
        if (result) {
          this.modelService.removeDayRecord(this.year!, this.month!, this.day!, this.recordingIndex!);
          this.hide();
        }
      }
    });
  }

  show(year: number, month: number, day: number, recordingIndex: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.recordingIndex = recordingIndex;
    this.canJoinWithPrevious = this.modelService.canJoinDayRecordWithPrevious(this.year!, this.month!, this.day!, this.recordingIndex!);
    this.visible = true;
  }

  split() {
    this.modelService.splitDayRecord(this.year!, this.month!, this.day!, this.recordingIndex!);
    this.hide();
  }
}
