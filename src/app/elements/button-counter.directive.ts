import { Directive, HostListener, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, interval, takeWhile } from 'rxjs';

@Directive({
  selector: '[tiuButtonCounter]',
})
export class ButtonCounterDirective {

  readonly counter = output<void>();

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
      this.counter.emit(undefined);
      interval(150)
        .pipe(delay(400), this.takeUntilDestroyed, takeWhile(() => el.hasPointerCapture(ev.pointerId)))
        .subscribe(() => this.counter.emit(undefined));
    }
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(ev: PointerEvent) {
    if (ev.button === 0 && (ev.target as HTMLElement).hasPointerCapture(ev.pointerId)) {
      (ev.target as HTMLElement).releasePointerCapture(ev.pointerId);
    }
  }

}
