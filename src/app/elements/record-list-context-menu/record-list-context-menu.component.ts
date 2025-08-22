import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { RecordListContextMenu } from './record-list-context-menu';
import { MessageBoxService } from '../../service/message-box.service';
import { AccountingService } from '../../service/accounting.service';

@Component({
  selector: 'tiu-record-list-context-menu',
  imports: [],
  templateUrl: './record-list-context-menu.component.html',
  styleUrl: './record-list-context-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.visible]': 'visible()'
  }
})
export class RecordListContextMenuComponent implements RecordListContextMenu {

  readonly visible = signal(false);
  readonly canJoinWithPrevious = signal(false);

  private readonly messageBoxService = inject(MessageBoxService);
  private readonly accountingService = inject(AccountingService);

  private year = 0;
  private month = 0;
  private day = 0;
  private recordIndex = 0;

  hide() {
    this.visible.set(false);
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

  onClick() {
    this.hide();
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
    this.canJoinWithPrevious.set(this.accountingService.canJoinWithPrevious(this.year, this.month, this.day, this.recordIndex));
    this.visible.set(true);
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
