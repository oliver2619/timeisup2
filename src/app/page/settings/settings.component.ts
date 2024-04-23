import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CheckButtonComponent } from "../../elements/check-button/check-button.component";
import { DayOfWeek } from "../../../model/dayofweek";
import { RouterModule } from '@angular/router';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { NumberInputComponent } from '../../elements/number-input/number-input.component';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { Store } from '@ngrx/store';
import { selectSettings } from '../../selector/settings-selectors';
import { settingsActions } from '../../action/settings-actions';
import { selectOverhours } from '../../selector/accounting-selectors';
import { AccountingService } from '../../service/accounting.service';

interface SettingsFormValue {
  maxHoursPerDay: number;
  hoursPerWeek: number;
  pensum: number;
  currentOvertime: number;
  dayOfWeek: boolean[];
}

@Component({
  selector: 'tiu-settings',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, CheckButtonComponent, RouterModule, HelpButtonDirective, NumberInputComponent, BackButtonDirective],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  readonly formGroup: FormGroup;
  readonly daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  private readonly initialValue: SettingsFormValue = {
    currentOvertime: 0,
    dayOfWeek: [],
    hoursPerWeek: 0,
    maxHoursPerDay: 0,
    pensum: 0
  };

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    return this.formGroup.valid && this.formGroup.dirty;
  }

  get error(): string | undefined {
    const errors = this.formGroup.errors;
    return errors == null ? undefined : Object.values(errors).map(it => String(it)).join(' ');
  }

  get hoursPerDay(): number {
    return this.calcHoursPerDay(this.value);
  }

  private get value(): SettingsFormValue {
    return this.formGroup.value as SettingsFormValue;
  }

  private readonly validatorDayOfWeekNotEmpty = (ctrl: AbstractControl) => {
    const days = this.calcNumberOfDays(ctrl.value as SettingsFormValue);
    return days > 0 ? null : ({ dayOfWeek: 'At least one day of week must be selected.' });
  };

  private readonly validatorHoursPerDay = (ctrl: AbstractControl) => {
    const v = ctrl.value as SettingsFormValue;
    const hoursPerDay = this.calcHoursPerDay(v);
    if (hoursPerDay >= 24) {
      return ({ maxHoursPerDay: 'Max hours per day must be less than 24 h.' });
    }
    return hoursPerDay <= v.maxHoursPerDay ? null : ({ maxHoursPerDay: 'Max hours per day must be greater or equal to hours per day.' });
  };

  constructor(private readonly store: Store, private readonly accountingService: AccountingService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('maxHoursPerDay', formBuilder.control(0, [Validators.required, Validators.min(1), Validators.max(24)]));
    this.formGroup.addControl('hoursPerWeek', formBuilder.control(0, [Validators.required, Validators.min(1), Validators.max(168)]));
    this.formGroup.addControl('pensum', formBuilder.control(0, [Validators.required, Validators.min(1), Validators.max(100)]));
    const array = formBuilder.array(this.daysOfWeek.map((_, i) => formBuilder.control(false)));
    this.formGroup.addControl('dayOfWeek', array);
    this.formGroup.addControl('currentOvertime', formBuilder.control(0, [Validators.required]));
    this.formGroup.setValidators([this.validatorDayOfWeekNotEmpty, this.validatorHoursPerDay]);
    this.store.select(selectSettings).subscribe({
      next: value => {
        this.initialValue.dayOfWeek = this.daysOfWeek.map(_ => false);
        value.workingDays.forEach(it => this.initialValue.dayOfWeek[it] = true);
        this.initialValue.hoursPerWeek = value.hoursPerWeek;
        this.initialValue.maxHoursPerDay = value.maxHoursPerDay;
        this.initialValue.pensum = value.pensumPercentage;
        this.formGroup.setValue(this.initialValue);
      }
    });
    this.store.select(selectOverhours).subscribe({
      next: value => {
        this.initialValue.currentOvertime = Math.round(value * 100) / 100;
        this.formGroup.setValue(this.initialValue);
      }
    });
  }

  isDayOfWeekActive(day: DayOfWeek): boolean {
    const v = this.value;
    return v.dayOfWeek[day];
  }

  setDayOfWeekActive(day: DayOfWeek, active: boolean) {
    const v = this.value;
    v.dayOfWeek[day] = active;
    this.formGroup.setValue(v);
    this.formGroup.markAsDirty();
  }

  reset() {
    const v = this.value;
    v.maxHoursPerDay = this.initialValue.maxHoursPerDay;
    v.hoursPerWeek = this.initialValue.hoursPerWeek;
    v.pensum = this.initialValue.pensum;
    v.dayOfWeek = this.initialValue.dayOfWeek.slice(0);
    v.currentOvertime = this.initialValue.currentOvertime;
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    const v = this.value;
    this.accountingService.setOverhours(this.value.currentOvertime);
    const workingDays: DayOfWeek[] = [];
    this.daysOfWeek.forEach((_, i) => {
      if (v.dayOfWeek[i]) {
        workingDays.push(i);
      }
    });
    this.store.dispatch(settingsActions.set({
      hoursPerWeek: v.hoursPerWeek,
      maxHoursPerDay: v.maxHoursPerDay,
      pensumPercentage: v.pensum,
      workingDays
    }));
    this.formGroup.markAsPristine();
  }

  private calcNumberOfDays(value: SettingsFormValue): number {
    return value.dayOfWeek.filter(it => it).length;
  }

  private calcHoursPerDay(value: SettingsFormValue): number {
    const days = this.calcNumberOfDays(value);
    return days > 0 ? value.hoursPerWeek * value.pensum / (100 * days) : 0;
  }
}
