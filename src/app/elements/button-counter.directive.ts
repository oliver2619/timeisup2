import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, interval,  takeWhile } from 'rxjs';

@Directive({
  selector: '[tiuButtonCounter]',
  standalone: true
})
export class ButtonCounterDirective {

  @Output('counter')
  readonly onCounter = new EventEmitter<void>();

  private takeUntilDestroyed = takeUntilDestroyed();

  @HostListener('contextmenu', ['$event'])
  onContextMenu(ev: MouseEvent) {
    ev.preventDefault();
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(ev: PointerEvent) {
    if (ev.button === 0) {
      const el = ev.target as HTMLElement;
      el.setPointerCapture(ev.pointerId);
      this.onCounter.emit();
      interval(150)
        .pipe(delay(400), this.takeUntilDestroyed, takeWhile(_ => el.hasPointerCapture(ev.pointerId)))
        .subscribe({
          next: _ => this.onCounter.emit()
        });
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0 && (ev.target as HTMLElement).hasPointerCapture(ev.pointerId)) {
      (ev.target as HTMLElement).releasePointerCapture(ev.pointerId);
    }
  }

}
