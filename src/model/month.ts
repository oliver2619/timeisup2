import { AggregatedRecordings } from "./aggregated-recordings";
import { ActiveJson } from "./model-json";
import { MonthJson } from "./month-json";
import { Project } from "./project";
import { ReadonlyRecord } from "./readonly-record";
import { Task } from "./task";
import { Workingday } from "./workingday";

export class Month {

  private _activeDay: Workingday | undefined;

  get activeDay(): number {
    if (this._activeDay == undefined) {
      return new Date().getDay();
    } else {
      return this._activeDay.day;
    }
  }

  get activeDayAggregatedRecordings(): AggregatedRecordings | undefined {
    const day = this._activeDay == undefined ? this.getDay(new Date()) : this._activeDay;
    return day?.getDayAggregatedRecordings();
  }

  get activeDayRecords(): ReadonlyRecord[] {
    const day = this._activeDay == undefined ? this.getDay(new Date()) : this._activeDay;
    return day?.readonlyRecords ?? [];
  }

  get days(): number[] {
    return this._days.map(it => it.day);
  }

  get isEmpty(): boolean {
    return this._days.length === 0;
  }

  private constructor(public month: number, public year: number, private readonly _days: Workingday[]) { }

  static load(json: MonthJson, projectsByName: (project: string) => Project): Month {
    const days = json.days.map(it => Workingday.load(it, projectsByName));
    return new Month(json.month, json.year, days);
  }

  static newInstance(month: number, year: number): Month {
    return new Month(month, year, []);
  }

  getComment(time: Date): string {
    if (this._activeDay == undefined) {
      return this.getDay(time)?.comment ?? '';
    } else {
      return this._activeDay.comment;
    }
  }

  getDayAggregatedRecordings(day: number): AggregatedRecordings | undefined {
    return this._days.find(it => it.day === day)?.getDayAggregatedRecordings();
  }

  getDayRecords(day: number): ReadonlyRecord[] {
    return this._days.find(it => it.day === day)?.readonlyRecords ?? [];
  }

  getWorkedHours(day: number): number {
    return this._days.find(it => it.day === day)?.workedHours ?? 0;
  }

  hasRecordings(day: number): boolean {
    return this._days.find(it => it.day === day) != undefined;
  }

  isProjectInUse(name: string): boolean {
    return this._days.some(it => it.isProjectInUse(name)) || (this._activeDay?.isProjectInUse(name) ?? false);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this._days.some(it => it.isTaskInUse(project, task)) || (this._activeDay?.isTaskInUse(project, task) ?? false);
  }

  loadActiveDay(json: ActiveJson) {
    this._activeDay = this._days.find(it => it.day === json.day);
  }

  removeDayRecord(day: number, index: number) {
    const d = this._days.find(it => it.day === day);
    if (d != undefined) {
      d.removeRecord(index);
      if (d.isEmpty) {
        this.removeDay(d);
      }
    }
  }

  removeDayRecords(day: number) {
    const d = this._days.find(it => it.day === day);
    if (d != undefined) {
      this.removeDay(d);
    }
  }

  save(): MonthJson {
    return {
      month: this.month,
      year: this.year,
      days: this._days.map(it => it.save())
    };
  }

  saveActiveDay(): ActiveJson | undefined {
    return this._activeDay == undefined ? undefined : {
      day: this._activeDay.day,
      month: this.month,
      year: this.year
    };
  }

  setDayRecord(day: number, index: number, start: Date, end: Date | undefined, task: Task) {
    const d = this._days.find(it => it.day === day);
    if (d == undefined) {
      throw new Error('No active day found');
    }
    d.setRecord(index, start, end, task);
  }

  setComment(time: Date, comment: string) {
    if (this._activeDay == undefined) {
      this.getOrCreateDay(time).comment = comment;
    } else {
      this._activeDay.comment = comment;
    }
  }

  startTask(time: Date, task: Task) {
    this.getOrCreateActiveDay(time).start(time, task);
  }

  stop() {
    this._activeDay?.stop();
    this._activeDay = undefined;
  }

  private getOrCreateActiveDay(time: Date): Workingday {
    if (this._activeDay != undefined) {
      return this._activeDay;
    }
    const day = this.getOrCreateDay(time);
    this._activeDay = day;
    return day;
  }

  private getOrCreateDay(time: Date): Workingday {
    const day = time.getDate();
    const found = this._days.find(it => it.day === day);
    if (found != undefined) {
      return found;
    }
    const newDay = Workingday.newInstance(day);
    this._days.push(newDay);
    return newDay;
  }

  private getDay(time: Date): Workingday | undefined {
    const day = time.getDate();
    return this._days.find(it => it.day === day);
  }

  private removeDay(day: Workingday) {
    const found = this._days.indexOf(day);
    if (found >= 0) {
      this._days.splice(found, 1);
      if (this._activeDay === day) {
        this._activeDay = undefined;
      }
    }
  }
}
