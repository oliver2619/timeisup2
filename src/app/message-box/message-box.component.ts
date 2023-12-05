import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxService } from '../message-box.service';
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

  question: string = '';

  private subject: Subject<boolean> | undefined;

  private set visible(v: boolean) {
    if (v) {
      this.element.nativeElement.classList.add('visible');
    } else {
      this.element.nativeElement.classList.remove('visible');
    }
  }

  constructor(private readonly messageBoxService: MessageBoxService, private readonly element: ElementRef<HTMLElement>) {
    messageBoxService.setHandler({
      question: message => this.doQuestion(message)
    });
  }

  ngOnDestroy(): void {
    this.messageBoxService.setHandler(undefined);
  }

  ok() {
    this.visible = false;
    const s = this.subject;
    this.subject = undefined;
    s?.next(true);
  }

  cancel() {
    this.visible = false;
    const s = this.subject;
    this.subject = undefined;
    s?.next(false);
  }

  private doQuestion(message: string): Observable<boolean> {
    this.question = message;
    this.visible = true;
    this.subject = new Subject();
    return this.subject;
  }
}
