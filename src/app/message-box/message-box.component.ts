import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxService, YesNoCancelResult } from '../message-box.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'tiu-message-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MessageBoxComponent implements OnDestroy {

  title = '';
  question = '';
  cancelVisible = false;
  okVisible = false;
  yesVisible = false;
  noVisible = false;

  private booleanSubject: Subject<boolean> | undefined;
  private yesNoCancelSubject: Subject<YesNoCancelResult> | undefined;

  private set visible(v: boolean) {
    if (v) {
      this.element.nativeElement.classList.add('visible');
    } else {
      this.element.nativeElement.classList.remove('visible');
    }
  }

  constructor(private readonly messageBoxService: MessageBoxService, private readonly element: ElementRef<HTMLElement>) {
    messageBoxService.setHandler({
      information: message => this.doInformation(message),
      question: message => this.doQuestion(message),
      questionYesNoCancel: message => this.doQuestionYesNoCancel(message)
    });
  }

  ngOnDestroy(): void {
    this.messageBoxService.setHandler(undefined);
  }

  yes() {
    this.visible = false;
    const bs = this.booleanSubject;
    const yncs = this.yesNoCancelSubject;
    this.booleanSubject = undefined;
    this.yesNoCancelSubject = undefined;
    bs?.next(true);
    yncs?.next(YesNoCancelResult.YES);
  }

  no() {
    this.visible = false;
    const yncs = this.yesNoCancelSubject;
    this.booleanSubject = undefined;
    this.yesNoCancelSubject = undefined;
    yncs?.next(YesNoCancelResult.NO);
  }

  cancel() {
    this.visible = false;
    const bs = this.booleanSubject;
    const yncs = this.yesNoCancelSubject;
    this.booleanSubject = undefined;
    this.yesNoCancelSubject = undefined;
    bs?.next(false);
    yncs?.next(YesNoCancelResult.CANCEL);
  }

  private doInformation(message: string) {
    this.title = 'Information';
    this.question = message;
    this.okVisible = true;
    this.yesVisible = false;
    this.cancelVisible = false;
    this.noVisible = false;
    this.visible = true;
  }

  private doQuestion(message: string): Observable<boolean> {
    this.title = 'Question';
    this.question = message;
    this.okVisible = true;
    this.yesVisible = false;
    this.cancelVisible = true;
    this.noVisible = false;
    this.visible = true;
    this.booleanSubject = new Subject();
    return this.booleanSubject;
  }

  private doQuestionYesNoCancel(message: string): Observable<YesNoCancelResult> {
    this.title = 'Question';
    this.question = message;
    this.okVisible = false;
    this.yesVisible = true;
    this.cancelVisible = true;
    this.noVisible = true;
    this.visible = true;
    this.yesNoCancelSubject = new Subject();
    return this.yesNoCancelSubject;
  }
}
