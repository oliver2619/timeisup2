import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import { ButtonErrorDirective } from '../button-error.directive';
import { ButtonCounterDirective } from '../button-counter.directive';

@Component({
  selector: 'tiu-time-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonErrorDirective, ButtonCounterDirective],
  templateUrl: './time-edit.component.html',
  styleUrl: './time-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeEditComponent {

  @Input('align-enabled')
  alignEnabled = false;

  @Input('forwards')
  forwards = false;

  @Input('hour')
  hourControl: FormControl<number> | undefined;

  @Input('minute')
  minuteControl: FormControl<number> | undefined;

  @Output('align')
  readonly alignEmitter = new EventEmitter<void>();

  get hourValue(): number {
    return this.hourControl?.value ?? 0;
  }

  get minuteValue(): number {
    return this.minuteControl?.value ?? 0;
  }

  onAlign() {
    this.alignEmitter.emit();
  }

  onChangeHour(hour: string) {
    if (this.hourControl != undefined) {
      this.hourControl.setValue(Number.parseInt(hour));
    }
  }

  onChangeHourBy(hour: number) {
    if (this.hourControl != undefined) {
      this.hourControl.setValue((this.hourControl.value + hour + 24) % 24);
    }
  }

  onChangeMinute(minute: string) {
    if (this.minuteControl != undefined) {
      this.minuteControl.setValue(Number.parseInt(minute));
    }
  }

  onChangeMinuteBy(minute: number) {
    if (this.minuteControl != undefined) {
      const newMinute = this.minuteControl.value + minute;
      if (newMinute < 0) {
        this.onChangeHourBy(-1);
      } else if (newMinute > 59) {
        this.onChangeHourBy(1);
      }
      this.minuteControl.setValue((newMinute + 60) % 60);
    }
  }

  startDecHour() {
    console.log('start')
  }

  stopDecHour() {
    console.log('stop')
  }
}
