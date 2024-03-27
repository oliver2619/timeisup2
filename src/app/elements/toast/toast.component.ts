import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Toast} from "../../toast.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {timer} from "rxjs";

@Component({
  selector: 'tiu-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnChanges {

  @Input()
  toast: Toast | undefined;

  @Output('finish')
  readonly onFinish = new EventEmitter<Toast>();

  private readonly untilDestroyed = takeUntilDestroyed<number>();

  ngOnChanges(changes: SimpleChanges) {
    if(this.toast != undefined) {
      timer(this.toast.until).pipe(this.untilDestroyed).subscribe({
        next: () => this.onFinish.emit(this.toast)
      });
    }
  }

  @HostListener('click')
  onClick() {
    this.onFinish.emit(this.toast);
  }

  get message(): string {
    return this.toast?.message ?? '';
  }
}
