import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonCounterDirective } from '../button-counter.directive';

@Component({
  selector: 'tiu-number-input',
  standalone: true,
  imports: [CommonModule, ButtonCounterDirective],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input('unit')
  unit: string = '';

  @Input('formGroup')
  formGroup: FormGroup | undefined;

  @Input('name')
  name: string | undefined;

  @Input('min')
  min: number | undefined;

  @Input('max')
  max: number | undefined;

  @Input('step')
  step = 1;

  @ViewChild('input')
  input: ElementRef<HTMLInputElement> | undefined;

  private control: AbstractControl<number | null> | undefined;
  private subscription: Subscription | undefined;
  private changeLock = false;

  get hasUnit(): boolean {
    return this.unit.length > 0;
  }

  get toggleSignEnabled(): boolean {
    if(this.min != undefined && this.min >= 0) {
      return false;
    }
    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup'] != undefined || changes['name'] != undefined) {
      if (this.formGroup != undefined && this.name != undefined) {
        this.setControl(this.formGroup.controls[this.name]);
      }
    }
  }

  ngAfterViewInit() {
    this.controlToInput();
  }

  ngOnDestroy() {
    if (this.subscription != undefined) {
      this.subscription.unsubscribe();
    }
  }

  onChangeInput() {
    this.doLocked(() => this.inputToControl());
    if (this.control != undefined) {
      this.control!.markAsDirty();
    }
  }

  change(amount: number) {
    this.changeValueCheckRange(current => {
      return this.filterRange(current == null ? amount * this.step : current + amount * this.step);
    });
  }

  toggleSign() {
    this.changeValueCheckRange(current => current == null ? null : -current);
  }

  private setControl(control: AbstractControl<number | null>) {
    if (this.control != control) {
      if (this.subscription != undefined) {
        this.subscription.unsubscribe();
        this.subscription = undefined;
      }
      this.control = control;
      if (this.control != undefined) {
        this.subscription = this.control.valueChanges.subscribe({
          next: _ => {
            if (!this.changeLock) {
              this.controlToInput();
            }
          }
        });
      }
      this.controlToInput();
    }
  }

  private controlToInput() {
    if (this.input != undefined) {
      if (this.control == undefined || this.control.value == null) {
        this.input.nativeElement.value = '';
      } else {
        this.input.nativeElement.value = String(this.control.value);
      }
    }
  }

  private filterRange(value: number | null): number | null {
    if(value == null) {
      return value;
    }
    if (this.step != 0) {
      value = Math.round(value / this.step) * this.step;
    }
    if (this.min != undefined && value < this.min) {
      value = this.min;
    }
    if (this.max != undefined && value > this.max) {
      value = this.max;
    }
    return value;
  }

  private inputToControl() {
    if (this.control != undefined && this.input != undefined) {
      const v = this.input.nativeElement.value;
      if (v == '') {
        this.control.setValue(null);
      } else {
        this.control.setValue(Number.parseFloat(v));
      }
    }
  }

  private doLocked(callback: () => void) {
    this.changeLock = true;
    try {
      callback();
    } finally {
      this.changeLock = false;
    }
  }

  private changeValueCheckRange(callback: (current: number | null) => number | null) {
    if (this.control != undefined) {
      const value = callback(this.control.value);
      this.control.setValue(value);
      this.control.markAsDirty();
    }

  }
}
