import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {ActivatedRoute, RouterModule} from '@angular/router';
import {DayRouteParams} from '../day-route-params';
import {DayEntriesComponent} from "../day-entries/day-entries.component";
import {CheckButtonComponent} from "../elements/check-button/check-button.component";
import {ModelService} from "../model.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { HelpButtonDirective } from '../elements/help-button.directive';
import { HoursPipe } from '../elements/hours.pipe';
import { DurationPipe } from '../elements/duration.pipe';

interface MonthEditEntryFormValue {
  comment: string;
}

@Component({
  selector: 'tiu-month-edit-entry',
  standalone: true,
  templateUrl: './month-edit-entry.component.html',
  styleUrl: './month-edit-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MenuComponent, DayEntriesComponent, DatePipe, CheckButtonComponent, ReactiveFormsModule, HelpButtonDirective, DurationPipe, HoursPipe]
})
export class MonthEditEntryComponent {

  readonly formGroup: FormGroup;

  year = 0;
  month = 0;
  day = 0;
  date = new Date();

  private _holiday = 0;

  get canSaveComment(): boolean {
    return this.formGroup.dirty;
  }

  get holiday(): number {
    return this._holiday;
  }

  set holiday(h: number) {
    this._holiday = h;
    this.modelService.setDayHoliday(this.year, this.month, this.day, h);
  }

  get absenceHours(): number {
    return this.modelService.hoursPerDay * this._holiday;
  }

  constructor(private readonly modelService: ModelService, formBuilder: FormBuilder, activatedRoute: ActivatedRoute) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('comment', formBuilder.control(''));
    activatedRoute.params.subscribe({
      next: paramsString => {
        const date: DayRouteParams = paramsString as DayRouteParams;
        this.year = Number.parseInt(date.year);
        this.month = Number.parseInt(date.month);
        this.day = Number.parseInt(date.day);
        this.date = new Date();
        this.date.setFullYear(this.year);
        this.date.setMonth(this.month);
        this.date.setDate(this.day);
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
        this._holiday = this.modelService.getDayHoliday(this.year, this.month, this.day);
        const v = this.value;
        v.comment = this.modelService.getDayComment(this.year, this.month, this.day);
        this.formGroup.setValue(v);
      }
    });
  }

  saveComment() {
    this.modelService.setDayComment(this.year, this.month, this.day, this.value.comment);
    this.formGroup.markAsPristine();
  }

  private get value(): MonthEditEntryFormValue {
    return this.formGroup.value;
  }
}
