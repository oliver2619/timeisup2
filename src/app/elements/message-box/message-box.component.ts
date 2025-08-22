import { ChangeDetectionStrategy, Component, OnDestroy, signal, inject } from '@angular/core';

import { MessageBoxService, YesNoCancelResult } from '../../service/message-box.service';
import { Observable, Subject } from 'rxjs';

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
export class MessageBoxComponent implements OnDestroy {

  readonly title = signal('');
  readonly question = signal('');
  readonly cancelVisible = signal(false);
  readonly okVisible = signal(false);
  readonly yesVisible = signal(false);
  readonly noVisible = signal(false);
  readonly visible = signal(false);

  private readonly messageBoxService = inject(MessageBoxService);

  private booleanSubject: Subject<boolean> | undefined;
  private yesNoCancelSubject: Subject<YesNoCancelResult> | undefined;

  constructor() {
    this.messageBoxService.setHandler({
      information: message => this.doInformation(message),
      question: message => this.doQuestion(message),
      questionYesNoCancel: message => this.doQuestionYesNoCancel(message)
    });
  }

  ngOnDestroy(): void {
    this.messageBoxService.setHandler(undefined);
  }

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

  private doInformation(message: string) {
    this.title.set('Information');
    this.question.set(message);
    this.okVisible.set(true);
    this.yesVisible.set(false);
    this.cancelVisible.set(false);
    this.noVisible.set(false);
    this.visible.set(true);
  }

  private doQuestion(message: string): Observable<boolean> {
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

  private doQuestionYesNoCancel(message: string): Observable<YesNoCancelResult> {
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
