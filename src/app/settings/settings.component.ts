import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModelService} from "../model.service";

interface SettingsFormValue {
  maxHoursPerDay: number;
  hoursPerWeek: number;
}

@Component({
  selector: 'tiu-settings',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  readonly formGroup: FormGroup;

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
    this.formGroup.addControl('maxHoursPerDay', formBuilder.control(this.modelService.maxHoursPerDay, [Validators.required, Validators.min(1), Validators.max(24)]))
    this.formGroup.addControl('hoursPerWeek', formBuilder.control(this.modelService.hoursPerWeek, [Validators.required, Validators.min(1), Validators.max(168)]))
  }

  reset() {
    const v = this.value;
    v.maxHoursPerDay = this.modelService.maxHoursPerDay;
    v.hoursPerWeek = this.modelService.hoursPerWeek;
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    this.modelService.maxHoursPerDay = this.value.maxHoursPerDay;
    this.modelService.hoursPerWeek = this.value.hoursPerWeek;
    this.formGroup.markAsPristine();
  }
}
