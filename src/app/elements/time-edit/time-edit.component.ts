import {ChangeDetectionStrategy, Component, output, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import { ButtonErrorDirective } from '../button-error.directive';
import { ButtonCounterDirective } from '../button-counter.directive';
import { NgClass } from '@angular/common';

@Component({
    selector: 'tiu-time-edit',
    imports: [ReactiveFormsModule, NgClass,  ButtonErrorDirective, ButtonCounterDirective],
    templateUrl: './time-edit.component.html',
    styleUrl: './time-edit.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeEditComponent {

  readonly alignEnabled = input(false, { alias: "align-enabled" });
  readonly forwards = input(false);
  readonly hourControl = input.required<FormControl<number | null>>({alias: 'hour'});
  readonly minuteControl = input.required<FormControl<number | null>>({alias: 'minute'});
  readonly alignEmitter = output<void>({ alias: 'align' });

  get hourValue(): number {
    return this.hourControl().value ?? 0;
  }

  get minuteValue(): number {
    return this.minuteControl().value ?? 0;
  }

  onAlign() {
    this.alignEmitter.emit(undefined);
  }

  onChangeHour(hour: string) {
    this.hourControl().setValue(hour === '' ? null : Number.parseInt(hour));
  }

  onChangeHourBy(hour: number) {
    if (this.hourControl().value != null) {
      this.hourControl().setValue((this.hourControl().value! + hour + 24) % 24);
    }
  }

  onChangeMinute(minute: string) {
    this.minuteControl().setValue(minute === '' ? null : Number.parseInt(minute));
  }

  onChangeMinuteBy(minute: number) {
    if (this.minuteControl().value != null) {
      const newMinute = this.minuteControl().value! + minute;
      if (newMinute < 0) {
        this.onChangeHourBy(-1);
      } else if (newMinute > 59) {
        this.onChangeHourBy(1);
      }
      this.minuteControl().setValue((newMinute + 60) % 60);
    }
  }
}
