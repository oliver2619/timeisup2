import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import {Toast, ToastService} from "../../service/toast.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ToastComponent} from "../toast/toast.component";
import { NgClass } from '@angular/common';

@Component({
    selector: 'tiu-toast-container',
    imports: [NgClass, ToastComponent],
    templateUrl: './toast-container.component.html',
    styleUrl: './toast-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {

  readonly toasts = signal<Toast[]>([]);

  constructor() {
    const toastService = inject(ToastService);

    toastService.onToast.pipe(takeUntilDestroyed()).subscribe({
      next: toast => this.onToast(toast)
    });
  }

  remove(toast: Toast) {
    this.toasts.update(value => value.filter(it => it != toast));
  }

  private onToast(toast: Toast) {
    this.toasts.update(value => [...value, toast]);
  }
}
