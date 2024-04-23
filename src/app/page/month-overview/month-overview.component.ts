import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MonthOverviewEntriesComponent } from '../../elements/month-overview-entries/month-overview-entries.component';
import { MessageBoxService, YesNoCancelResult } from '../../service/message-box.service';
import { HoursPipe } from '../../elements/hours.pipe';
import { RouterModule } from '@angular/router';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { DurationPipe } from '../../elements/duration.pipe';
import { combineLatest, concat, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccountedMonths, selectAccounting } from '../../selector/accounting-selectors';
import { AccountingService } from '../../service/accounting.service';

interface MonthOverviewFormValue {
  month: string;
}

@Component({
  selector: 'tiu-month-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent, MonthOverviewEntriesComponent, HoursPipe, DurationPipe, RouterModule, HelpButtonDirective],
  templateUrl: './month-overview.component.html',
  styleUrl: './month-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthOverviewComponent {

  readonly MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  readonly formGroup: FormGroup;
  readonly years$: Observable<{ year: number, months: number[] }[]>;
  readonly overhours = signal(0);
  readonly selectedMonth = signal(0);
  readonly selectedYear = signal(0);
  readonly hasSelection = signal(false);

  get canRemoveAll(): boolean {
    return this.formGroup.valid;
  }

  private get value(): MonthOverviewFormValue {
    return this.formGroup.value as MonthOverviewFormValue;
  }

  constructor(private readonly accountingService: AccountingService, private readonly messageBoxService: MessageBoxService, store: Store, formBuilder: FormBuilder) {
    this.years$ = store.select(selectAccountedMonths);
    this.formGroup = formBuilder.group({});
    const monthControl = formBuilder.control('', Validators.required);
    this.formGroup.addControl('month', monthControl);
    this.years$.subscribe({
      next: years => {
        if (years.length > 0) {
          const v = this.value;
          const year = years[years.length - 1];
          const month = year.months[year.months.length - 1];
          v.month = `${year.year}-${month}`;
          this.formGroup.setValue(v);
        }
      }
    });
    
    const selectMonth$ = concat(of(monthControl.value), monthControl.valueChanges);
    combineLatest([store.select(selectAccounting), selectMonth$]).subscribe({
      next: ([accounting, month]) => {
        if (month != null && month !== '') {
          const date = String(month).split('-').map(v => Number.parseInt(v));
          this.selectedMonth.set(date[1]);
          this.selectedYear.set(date[0]);
          this.hasSelection.set(true);
          this.overhours.set(accounting.months.find(m => m.year === date[0] && m.month === date[1])?.overhours ?? 0);
        }
      }
    });
  }

  removeAll() {
    this.messageBoxService.questionYesNoCancel('All recordings for the entire month will be deleted. Do you want to save the month\'s overtime?').subscribe({
      next: result => {
        if (result !== YesNoCancelResult.CANCEL) {
          this.accountingService.deleteMonth(this.selectedYear(), this.selectedMonth(), result === YesNoCancelResult.YES).subscribe({ next: _ => { } });
        }
      }
    });
  }
}
