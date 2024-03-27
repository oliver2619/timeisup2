import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModelService} from "../model.service";
import {CheckButtonComponent} from "../elements/check-button/check-button.component";
import {DayOfWeek} from "../../model/dayofweek";

interface SettingsFormValue {
  maxHoursPerDay: number;
  hoursPerWeek: number;
  pensum: number;
  dayOfWeek: boolean[];
}

@Component({
  selector: 'tiu-settings',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, CheckButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  readonly formGroup: FormGroup;
  readonly daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    return this.formGroup.valid && this.formGroup.dirty;
  }

  private get value(): SettingsFormValue {
    return this.formGroup.value as SettingsFormValue;
  }

  constructor(private readonly modelService: ModelService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('maxHoursPerDay', formBuilder.control(this.modelService.maxHoursPerDay, [Validators.required, Validators.min(1), Validators.max(24)]));
    this.formGroup.addControl('hoursPerWeek', formBuilder.control(this.modelService.hoursPerWeek, [Validators.required, Validators.min(1), Validators.max(168)]));
    this.formGroup.addControl('pensum', formBuilder.control(this.modelService.pensum, [Validators.required, Validators.min(1), Validators.max(100)]));
    const array = formBuilder.array(this.daysOfWeek.map((_, i) => formBuilder.control(this.modelService.isDayOfWeekActive(i))));
    this.formGroup.addControl('dayOfWeek', array);
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
    v.maxHoursPerDay = this.modelService.maxHoursPerDay;
    v.hoursPerWeek = this.modelService.hoursPerWeek;
    v.pensum = this.modelService.pensum;
    v.dayOfWeek = this.daysOfWeek.map((_, i) => this.modelService.isDayOfWeekActive(i));
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    this.modelService.maxHoursPerDay = this.value.maxHoursPerDay;
    this.modelService.hoursPerWeek = this.value.hoursPerWeek;
    this.modelService.pensum = this.value.pensum;
    this.daysOfWeek.forEach((_, i) => this.modelService.setDayOfWeekActive(i, this.value.dayOfWeek[i]));
    this.formGroup.markAsPristine();
  }
}
