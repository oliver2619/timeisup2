import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { ModelService } from '../model.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MonthOverviewEntriesComponent } from '../month-overview-entries/month-overview-entries.component';
import { MessageBoxService } from '../message-box.service';
import { HoursPipe } from '../elements/hours.pipe';

interface MonthOption {
  readonly key: string;
  readonly value: string;
}

interface MonthOverviewFormValue {
  month: string;
}

@Component({
  selector: 'tiu-month-overview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MenuComponent, MonthOverviewEntriesComponent, HoursPipe],
  templateUrl: './month-overview.component.html',
  styleUrl: './month-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MonthOverviewComponent {

  private static readonly MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  readonly formGroup: FormGroup;

  years: number[] = [];

  get overhours(): number {
    return this.selectedYear != undefined && this.selectedMonth != undefined ? this.modelService.getOverhoursOfMonth(this.selectedYear, this.selectedMonth) : 0;
  }

  get selectedMonth(): number | undefined {
    const month = this.value.month;
    return month === '' ? undefined : Number.parseInt(month.split('-')[1]);
  }

  get selectedYear(): number | undefined {
    const month = this.value.month;
    return month === '' ? undefined : Number.parseInt(month.split('-')[0]);
  }

  get canRemoveAll(): boolean {
    return this.selectedMonth != undefined && this.selectedYear != undefined;
  }

  private get value(): MonthOverviewFormValue {
    return this.formGroup.value as MonthOverviewFormValue;
  }

  constructor(private readonly modelService: ModelService, private readonly messageBoxService: MessageBoxService, formBuilder: FormBuilder) {
    this.updateYears();
    let selectedMonth = '';
    if (this.years.length > 0) {
      const options = this.getMonthsOfYear(this.years[this.years.length - 1]);
      selectedMonth = options[options.length - 1].key;
    }
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('month', formBuilder.control(selectedMonth));
  }

  getMonthsOfYear(year: number): MonthOption[] {
    return this.modelService
      .getRecordedMonths(year)
      .sort((m1, m2) => m1 - m2)
      .map(it => {
        const ret: MonthOption = {
          key: `${year}-${it}`,
          value: MonthOverviewComponent.MONTHS[it]
        };
        return ret;
      });
  }

  removeAll() {
    this.messageBoxService.question('Do you want to remove all recordings for the entire month?').subscribe({
      next: result => {
        if (result) {
          this.modelService.removeMonthRecords(this.selectedYear!, this.selectedMonth!);
          this.updateYears();
        }
      }
    });
  }

  private updateYears() {
    this.years = this.modelService.recorededYears.sort((y1, y2) => y1 - y2);
  }

}
