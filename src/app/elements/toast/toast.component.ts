import { ChangeDetectionStrategy, Component, HostListener, OnInit, computed, effect, input, output, signal } from '@angular/core';

import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { timer } from "rxjs";
import { Toast } from "../../service/toast.service";

@Component({
  selector: 'tiu-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.visible]': 'visible()'
  }
})
export class ToastComponent implements OnInit {

  readonly toast = input.required<Toast>();
  readonly onFinish = output<Toast>({ alias: 'finish' });
  readonly visible = signal(false);
  readonly message = computed(() => this.toast().message);

  private readonly untilDestroyed = takeUntilDestroyed<number>();

  constructor() {
    effect(() => {
      timer(this.toast().until).pipe(this.untilDestroyed).subscribe(() => this.visible.set(false));
    });
  }

  ngOnInit() {
    window.setTimeout(() => this.visible.set(true), 1);
  }

  @HostListener('click')
  onClick() {
    this.visible.set(false);
  }

  @HostListener('transitionend')
  onAnimationEnd() {
    if (!this.visible()) {
      this.onFinish.emit(this.toast());
    }
  }
}
