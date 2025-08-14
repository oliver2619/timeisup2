import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuComponent } from "../../elements/menu/menu.component";
import { NumberInputComponent } from "../../elements/number-input/number-input.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AccountingService } from '../../service/accounting.service';
import { selectOverhours } from '../../selector/accounting-selectors';
import { HelpButtonDirective } from '../../elements/help-button.directive';

interface OverhoursFormValue {
  currentOvertime: number;
}

@Component({
  selector: 'tiu-overhours',
  imports: [ReactiveFormsModule, MenuComponent, NumberInputComponent, HelpButtonDirective],
  templateUrl: './overhours.component.html',
  styleUrl: './overhours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverhoursComponent {

  readonly formGroup: FormGroup;

  private readonly initialValue: OverhoursFormValue = {
    currentOvertime: 0,
  };

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    return this.formGroup.valid && this.formGroup.dirty;
  }

  private get value(): OverhoursFormValue {
    return this.formGroup.value as OverhoursFormValue;
  }

  constructor(private readonly store: Store, private readonly accountingService: AccountingService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('currentOvertime', formBuilder.control(0, [Validators.required]));
    this.store.select(selectOverhours).subscribe({
      next: value => {
        this.initialValue.currentOvertime = Math.round(value * 100) / 100;
        this.formGroup.setValue(this.initialValue);
      }
    });
  }

  reset() {
    const v = this.value;
    v.currentOvertime = this.initialValue.currentOvertime;
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    const v = this.value;
    this.accountingService.setOverhours(this.value.currentOvertime);
    this.formGroup.markAsPristine();
  }

}
