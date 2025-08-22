import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnChanges, OnDestroy, SimpleChanges, computed, input, viewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonCounterDirective } from '../button-counter.directive';

@Component({
  selector: 'tiu-number-input',
  imports: [ButtonCounterDirective],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent implements OnChanges, OnDestroy, AfterViewInit {

  readonly unit = input<string>('');
  readonly formGroup = input.required<FormGroup>();
  readonly name = input.required<string>();
  readonly min = input<number>();
  readonly max = input<number>();
  readonly step = input(1);
  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  readonly toggleSignEnabled = computed(() => this.min() == undefined || this.min()! < 0);
  readonly hasUnit = computed(() => this.unit().length > 0);

  private control: AbstractControl<number | null> | undefined;
  private subscription: Subscription | undefined;
  private changeLock = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup'] != undefined || changes['name'] != undefined) {
      if (this.formGroup != undefined && this.name != undefined) {
        this.setControl(this.formGroup().controls[this.name()]);
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
      return this.filterRange(current == null ? amount * this.step() : current + amount * this.step());
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
    if (this.control == undefined || this.control.value == null) {
      this.input().nativeElement.value = '';
    } else {
      this.input().nativeElement.value = String(this.control.value);
    }
  }

  private filterRange(value: number | null): number | null {
    if (value == null) {
      return value;
    }
    if (this.step() != 0) {
      value = Math.round(value / this.step()) * this.step();
    }
    if (this.min() != undefined && value < this.min()!) {
      value = this.min()!;
    }
    if (this.max() != undefined && value > this.max()!) {
      value = this.max()!;
    }
    return value;
  }

  private inputToControl() {
    if (this.control != undefined) {
      const v = this.input().nativeElement.value;
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
