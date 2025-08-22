import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { MessageBoxService } from '../service/message-box.service';

@Directive({
  selector: '[tiuButtonError]',
})
export class ButtonErrorDirective {

  @Input('tiuButtonError')
  message = '';

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly messageBoxService = inject(MessageBoxService);

  @HostListener('contextmenu', ['$event'])
  onContextmenu(ev: Event) {
    const element = this.elementRef.nativeElement;
    if (element instanceof HTMLButtonElement && element.disabled && this.message.length > 0) {
      this.messageBoxService.information(this.message);
      ev.preventDefault();
    }
  }
}
