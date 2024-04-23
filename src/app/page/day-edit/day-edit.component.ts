import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DayRouteParams } from '../../day-route-params';
import { RecordListComponent } from "../../elements/record-list/record-list.component";
import { CheckButtonComponent } from "../../elements/check-button/check-button.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { HoursPipe } from '../../elements/hours.pipe';
import { DurationPipe } from '../../elements/duration.pipe';
import { AccountingService } from '../../service/accounting.service';
import { Dates } from '../../model/dates';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccounting } from '../../selector/accounting-selectors';
import { selectHoursPerDay } from '../../selector/settings-selectors';

interface MonthEditEntryFormValue {
  comment: string;
}

@Component({
  selector: 'tiu-month-edit-entry',
  standalone: true,
  templateUrl: './day-edit.component.html',
  styleUrl: './day-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MenuComponent, RecordListComponent, DatePipe, CheckButtonComponent, ReactiveFormsModule, HelpButtonDirective, DurationPipe, HoursPipe]
})
export class DayEditComponent {

  readonly formGroup: FormGroup;
  readonly year = signal(0);
  readonly month = signal(0);
  readonly day = signal(0);
  readonly absenceHours = signal(0);

  date = new Date();

  private _absence = 0;

  get canSaveComment(): boolean {
    return this.formGroup.dirty;
  }

  get absence(): number {
    return this._absence;
  }

  set absence(absence: number) {
    this._absence = absence;
    this.accountingService.setDayAbsence(this.year(), this.month(), this.day(), absence);
  }

  constructor(private readonly accountingService: AccountingService, store: Store, formBuilder: FormBuilder, activatedRoute: ActivatedRoute) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('comment', formBuilder.control(''));
    combineLatest([activatedRoute.params, store.select(selectAccounting), store.select(selectHoursPerDay)]).subscribe({
      next: ([paramsString, acc, hoursPerDay]) => {
        const date: DayRouteParams = paramsString as DayRouteParams;
        this.year.set(Number.parseInt(date.year));
        this.month.set(Number.parseInt(date.month));
        this.day.set(Number.parseInt(date.day));
        this.date = Dates.fromDay(this.year(), this.month(), this.day());
        const day = acc.months.find(m => m.year === this.year() && m.month === this.month())?.days.find(d => d.day === this.day());
        if (day != undefined) {
          this._absence = day.absence;
          this.absenceHours.set(this._absence * hoursPerDay);
          const v = this.value;
          v.comment = day.comment;
          this.formGroup.setValue(v);
        }
      }
    });
  }

  saveComment() {
    this.accountingService.setDayComment(this.year(), this.month(), this.day(), this.value.comment);
    this.formGroup.markAsPristine();
  }

  private get value(): MonthEditEntryFormValue {
    return this.formGroup.value;
  }
}
