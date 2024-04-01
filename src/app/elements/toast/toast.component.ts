import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
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
export class ToastComponent implements OnChanges, OnInit {

  @Input()
  toast: Toast | undefined;

  @Output('finish')
  readonly onFinish = new EventEmitter<Toast>();

  @HostBinding('class.visible')
  visible = false;

  private readonly untilDestroyed = takeUntilDestroyed<number>();

  get message(): string {
    return this.toast?.message ?? '';
  }

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if(changes['toast'] != undefined && this.toast != undefined) {
      timer(this.toast.until).pipe(this.untilDestroyed).subscribe({
        next: () => {
          this.visible = false;
          this.changeDetectorRef.markForCheck();
        }
      });
    }
  }

  ngOnInit(){
    window.setTimeout(()=>{
      this.visible = true;
      this.changeDetectorRef.markForCheck();
    }, 1);
  }

  @HostListener('click')
  onClick() {
    this.visible = false;
  }

  @HostListener('transitionend')
  onAnimationEnd() {
    if(!this.visible) {
      this.onFinish.emit(this.toast);
    }
  }
}
