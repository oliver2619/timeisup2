import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { YesNoCancelResult } from '../../service/message-box.service';
import { Observable, Subject } from 'rxjs';
import { MessageBox } from './message-box';

@Component({
  selector: 'tiu-message-box',
  imports: [],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.visible]': 'visible()',
  }
})
export class MessageBoxComponent implements MessageBox {

  readonly title = signal('');
  readonly question = signal('');
  readonly cancelVisible = signal(false);
  readonly okVisible = signal(false);
  readonly yesVisible = signal(false);
  readonly noVisible = signal(false);
  readonly visible = signal(false);

  private booleanSubject: Subject<boolean> | undefined;
  private yesNoCancelSubject: Subject<YesNoCancelResult> | undefined;

  yes() {
    this.visible.set(false);
    const bs = this.booleanSubject;
    const yncs = this.yesNoCancelSubject;
    this.booleanSubject = undefined;
    this.yesNoCancelSubject = undefined;
    bs?.next(true);
    yncs?.next(YesNoCancelResult.YES);
  }

  no() {
    this.visible.set(false);
    const yncs = this.yesNoCancelSubject;
    this.booleanSubject = undefined;
    this.yesNoCancelSubject = undefined;
    yncs?.next(YesNoCancelResult.NO);
  }

  cancel() {
    this.visible.set(false);
    const bs = this.booleanSubject;
    const yncs = this.yesNoCancelSubject;
    this.booleanSubject = undefined;
    this.yesNoCancelSubject = undefined;
    bs?.next(false);
    yncs?.next(YesNoCancelResult.CANCEL);
  }

  showInformation(message: string): void {
    this.title.set('Information');
    this.question.set(message);
    this.okVisible.set(true);
    this.yesVisible.set(false);
    this.cancelVisible.set(false);
    this.noVisible.set(false);
    this.visible.set(true);
  }

  showQuestionOkCancel(message: string): Observable<boolean> {
    this.title.set('Question');
    this.question.set(message);
    this.okVisible.set(true);
    this.yesVisible.set(false);
    this.cancelVisible.set(true);
    this.noVisible.set(false);
    this.visible.set(true);
    this.booleanSubject = new Subject();
    return this.booleanSubject;
  }

  showQuestionYesNoCancel(message: string): Observable<YesNoCancelResult> {
    this.title.set('Question');
    this.question.set(message);
    this.okVisible.set(false);
    this.yesVisible.set(true);
    this.cancelVisible.set(true);
    this.noVisible.set(true);
    this.visible.set(true);
    this.yesNoCancelSubject = new Subject();
    return this.yesNoCancelSubject;
  }
}
