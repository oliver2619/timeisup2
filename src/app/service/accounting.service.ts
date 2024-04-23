import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import _ from 'lodash';
import { Observable, of } from 'rxjs';
import { AccountingJson } from '../../model/accounting-json';
import { ModelJson, modelJsonStorePrefix } from '../../model/model-json';
import { accountingActions } from '../action/accounting-actions';
import { Accountings } from '../model/accountings';
import { Settings } from '../model/settings';
import { Task } from '../model/task';
import { selectCurrentTask } from '../selector/accounting-selectors';
import { selectSettings } from '../selector/settings-selectors';

const accountingJsonLocalStoreKey = `${modelJsonStorePrefix}accounting`;

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private static readonly TIMER_TIMEOUT = 500;

  private timer: number | undefined;
  private settings: Settings = new Settings(0, 0, new Set());
  private model: Accountings;

  constructor(private readonly store: Store) {
    this.model = this.load(this.settings);
    this.store.dispatch(accountingActions.load(this.model.getState(this.settings)));
    store.select(selectCurrentTask).subscribe({
      next: task => {
        if (task == undefined) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
      }
    });
    store.select(selectSettings).subscribe({
      next: s => {
        this.settings = new Settings(s.hoursPerWeek, s.pensumPercentage / 100, new Set(s.workingDays));
        this.store.dispatch(accountingActions.load(this.model.getState(this.settings)));
      }
    });
  }

  deleteDay(year: number, month: number, day: number): Observable<boolean> {
    this.model.deleteDay(year, month, day);
    this.updateState();
    return of(true);
  }

  deleteMonth(year: number, month: number, keepOvertime: boolean): Observable<boolean> {
    this.model.deleteMonth(year, month, keepOvertime, this.settings);
    this.updateState();
    return of(true);
  }

  deleteRecord(year: number, month: number, day: number, recordIndex: number): Observable<boolean> {
    this.model.deleteRecord(year, month, day, recordIndex);
    this.updateState();
    return of(true);
  }

  isProjectInUse(project: string): boolean {
    return this.model.isProjectInUse(project);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this.model.isTaskInUse(project, task);
  }

  joinRecordWithPrevious(year: number, month: number, day: number, recordIndex: number): Observable<boolean> {
    this.model.joinRecordWithPrevious(year, month, day, recordIndex);
    this.updateState();
    return of(true);
  }

  renameProject(project: string, newName: string) {
    this.model.renameProject(project, newName);
    this.updateState();
  }

  renameTask(project: string, task: string, newName: string) {
    this.model.renameTask(project, task, newName);
    this.updateState();
  }

  setCommentToCurrentDay(comment: string): Observable<boolean> {
    this.model.setCommentToCurrentDay(comment);
    this.updateState();
    return of(true);
  }

  setDayAbsence(year: number, month: number, day: number, absence: number): Observable<boolean> {
    this.model.setDayAbsence(year, month, day, absence);
    this.updateState();
    return of(true);
  }

  setDayComment(year: number, month: number, day: number, comment: string): Observable<boolean> {
    this.model.setCommentToDay(year, month, day, comment);
    this.updateState();
    return of(true);
  }

  setOverhours(overhours: number): Observable<boolean> {
    this.model.setOverhours(overhours, this.settings);
    this.updateState();
    return of(true);
  }

  setRecord(year: number, month: number, day: number, recordIndex: number, projectName: string, taskName: string, startTime: number, endTime: number | undefined): Observable<boolean> {
    const startDate = new Date(startTime);
    this.settings.adjustTime(startDate);
    const endDate = endTime == undefined ? undefined : new Date(endTime);
    if (endDate != undefined) {
      this.settings.adjustTime(endDate);
    }
    this.model.setRecord(year, month, day, recordIndex, new Task(projectName, taskName), startDate, endDate);
    this.updateState();
    return of(true);
  }

  splitRecord(year: number, month: number, day: number, recordIndex: number): Observable<boolean> {
    this.model.splitRecord(year, month, day, recordIndex, this.settings);
    this.updateState();
    return of(true);
  }

  startRecording(projectName: string, taskName: string): Observable<boolean> {
    this.model.startRecording(new Task(projectName, taskName));
    this.updateState();
    return of(true);
  }

  stopRecording(): Observable<boolean> {
    this.model.stopRecording();
    this.updateState();
    return of(true);
  }

  private onTimer() {
    if (this.model.incrementTime(this.settings)) {
      this.updateState();
    }
  }

  private load(settings: Settings): Accountings {
    const accountingJson = localStorage.getItem(accountingJsonLocalStoreKey);
    if (accountingJson != null) {
      return Accountings.loadFromAccountingJson(JSON.parse(accountingJson) as AccountingJson, settings);
    }
    const modelJson = localStorage.getItem(modelJsonStorePrefix);
    if (modelJson != null) {
      return Accountings.loadFromModelJson(JSON.parse(modelJson) as ModelJson, settings);
    }
    return Accountings.newInstance(settings);
  }

  private startTimer() {
    if (this.timer == undefined) {
      this.timer = window.setInterval(() => this.onTimer(), AccountingService.TIMER_TIMEOUT);
    }
  }

  private stopTimer() {
    if (this.timer != undefined) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private updateState() {
    localStorage.setItem(accountingJsonLocalStoreKey, JSON.stringify(this.model.save()));
    this.store.dispatch(accountingActions.load(this.model.getState(this.settings)));
  }
}
