import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModelService} from "../model.service";

interface SettingsFormValue {
  maxHoursPerDay: number;
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

  private get value(): SettingsFormValue {
    return this.formGroup.value as SettingsFormValue;
  }

  constructor(private readonly modelService: ModelService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('maxHoursPerDay', formBuilder.control(this.modelService.maxHoursPerDay, [Validators.required, Validators.min(1), Validators.max(24)]))
  }

  reset() {
    const v = this.value;
    v.maxHoursPerDay = this.modelService.maxHoursPerDay;
    this.formGroup.setValue(v);
  }

  save() {
    this.modelService.maxHoursPerDay = this.value.maxHoursPerDay;
  }

}
