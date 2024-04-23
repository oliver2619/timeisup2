import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordListContextMenu } from './record-list-context-menu';
import { MessageBoxService } from '../../service/message-box.service';
import { AccountingService } from '../../service/accounting.service';

@Component({
  selector: 'tiu-record-list-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-list-context-menu.component.html',
  styleUrl: './record-list-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordListContextMenuComponent implements RecordListContextMenu {

  private year: number = 0;
  private month: number = 0;
  private day: number = 0;
  private recordIndex: number = 0;

  @HostBinding('class.visible')
  visible = false;

  constructor(private readonly messageBoxService: MessageBoxService, private readonly accountingService: AccountingService) { }

  onClick() {
    this.hide();
  }

  hide() {
    this.visible = false;
  }

  joinWithPrevious() {
    this.messageBoxService.question('Do you want to join the two records and truncate the break between?').subscribe({
      next: result => {
        if (result) {
          this.accountingService.joinRecordWithPrevious(this.year, this.month, this.day, this.recordIndex).subscribe({
            next: result => {
              if (result) {
                this.hide();
              }
            }
          });
        }
      }
    });
  }

  remove() {
    this.messageBoxService.question('Do you want to remove this record?').subscribe({
      next: result => {
        if (result) {
          this.accountingService.deleteRecord(this.year, this.month, this.day, this.recordIndex).subscribe({
            next: result => {
              if (result) {
                this.hide();
              }
            }
          });
        }
      }
    });
  }

  show(year: number, month: number, day: number, recordIndex: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.recordIndex = recordIndex;
    this.visible = true;
  }

  split() {
    this.accountingService.splitRecord(this.year, this.month, this.day, this.recordIndex).subscribe({
      next: result => {
        if (result) {
          this.hide()
        }
      }
    });
  }
}
