import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MessageBoxService } from '../message-box.service';

@Directive({
  selector: '[tiuButtonError]',
  standalone: true
})
export class ButtonErrorDirective {

  @Input('tiuButtonError')
  message: string = '';
  
  constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly messageBoxService: MessageBoxService) { }

  @HostListener('contextmenu', ['$event'])
  onContextmenu(ev: Event) {
    const element = this.elementRef.nativeElement;
    if(element instanceof HTMLButtonElement && element.disabled && this.message.length > 0) {
      this.messageBoxService.information(this.message);
      ev.preventDefault();
    }
  }
}
