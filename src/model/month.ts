import {AggregatedRecordings} from "./aggregated-recordings";
import {ActiveJson} from "./model-json";
import {MonthJson} from "./month-json";
import {Project} from "./project";
import {ReadonlyRecord} from "./readonly-record";
import {Task} from "./task";
import {Workingday} from "./workingday";
import {DayOfWeek} from "./dayofweek";

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
    const day = this._activeDay == undefined ? this.getDayByDate(new Date()) : this._activeDay;
    return day?.getDayAggregatedRecordings();
  }

  get activeDayRecords(): ReadonlyRecord[] {
    const day = this._activeDay == undefined ? this.getDayByDate(new Date()) : this._activeDay;
    return day?.readonlyRecords ?? [];
  }

  get days(): number[] {
    return this._days.map(it => it.day);
  }

  get isEmpty(): boolean {
    return this._days.length === 0;
  }

  private constructor(public month: number, public year: number, private readonly _days: Workingday[]) {
  }

  static load(json: MonthJson, projectsByName: (project: string) => Project): Month {
    const days = json.days.map(it => Workingday.load(it, projectsByName));
    return new Month(json.month, json.year, days);
  }

  static newInstance(month: number, year: number): Month {
    return new Month(month, year, []);
  }

  getComment(day: number): string {
    return this.getDay(day)?.comment ?? '';
  }

  getCommentByDate(time: Date): string {
    if (this._activeDay == undefined) {
      return this.getDayByDate(time)?.comment ?? '';
    } else {
      return this._activeDay.comment;
    }
  }

  getDayAggregatedRecordings(day: number): AggregatedRecordings | undefined {
    return this.getDay(day)?.getDayAggregatedRecordings();
  }

  getDayHoliday(day: number): number {
    return this.getDay(day)?.holiday ?? 0;
  }

  getDayRecords(day: number): ReadonlyRecord[] {
    return this.getDay(day)?.readonlyRecords ?? [];
  }

  getUnrecordedDays(daysOfWeek: Set<DayOfWeek>): number[] {
    const date = new Date();
    date.setTime(0);
    date.setFullYear(this.year, this.month, 1);
    const ret: number[] = [];
    while (date.getMonth() == this.month) {
      if (!this.hasRecordings(date.getDate()) && daysOfWeek.has(date.getDay())) {
        ret.push(date.getDate());
      }
      date.setDate(date.getDate() + 1);
    }
    return ret;
  }

  getWorkedHours(day: number): number {
    return this.getDay(day)?.workedHours ?? 0;
  }

  hasRecordings(day: number): boolean {
    return this.getDay(day) != undefined;
  }

  isProjectInUse(name: string): boolean {
    return this._days.some(it => it.isProjectInUse(name)) || (this._activeDay?.isProjectInUse(name) ?? false);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this._days.some(it => it.isTaskInUse(project, task)) || (this._activeDay?.isTaskInUse(project, task) ?? false);
  }

  loadActiveDay(json: ActiveJson) {
    this._activeDay = this.getDay(json.day);
  }

  markDayAsHoliday(day: number, holiday: number) {
    this.getOrCreateDay(day).holiday = holiday;
  }

  removeDayRecord(day: number, index: number) {
    const d = this.getDay(day);
    if (d != undefined) {
      d.removeRecord(index);
      if (d.isEmpty) {
        this.removeDay(d);
      }
    }
  }

  removeDayRecords(day: number) {
    const d = this.getDay(day);
    if (d != undefined) {
      this.removeDay(d);
    }
  }

  removeHoliday(day: number) {
    const found = this.getDay(day);
    if (found != undefined) {
      found.holiday = 0;
      if (found.isEmpty) {
        this.removeDay(found);
      }
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

  setDayComment(day: number, comment: string) {
    const d = this.getDay(day);
    if (d == undefined) {
      throw new Error(`Day ${day} not found`);
    }
    d.comment = comment;
  }

  setDayRecord(day: number, index: number, start: Date, end: Date | undefined, task: Task) {
    const d = this.getDay(day);
    if (d == undefined) {
      throw new Error(`Day ${day} not found`);
    }
    d.setRecord(index, start, end, task);
  }

  setComment(time: Date, comment: string) {
    if (this._activeDay == undefined) {
      this.getOrCreateDayByDate(time).comment = comment;
    } else {
      this._activeDay.comment = comment;
    }
  }

  startTask(time: Date, task: Task, onStopTask: (task: Task) => void) {
    this.getOrCreateActiveDay(time).start(time, task, onStopTask);
  }

  stop(onStopTask: (task: Task) => void) {
    this._activeDay?.stop(onStopTask);
    this._activeDay = undefined;
  }

  private getOrCreateActiveDay(time: Date): Workingday {
    if (this._activeDay != undefined) {
      return this._activeDay;
    }
    const day = this.getOrCreateDayByDate(time);
    this._activeDay = day;
    return day;
  }

  private getOrCreateDay(day: number): Workingday {
    const found = this.getDay(day);
    if (found != undefined) {
      return found;
    }
    const newDay = Workingday.newInstance(day);
    this._days.push(newDay);
    return newDay;
  }

  private getOrCreateDayByDate(time: Date): Workingday {
    return this.getOrCreateDay(time.getDate());
  }

  private getDay(day: number): Workingday | undefined {
    return this._days.find(it => it.day === day);
  }

  private getDayByDate(time: Date): Workingday | undefined {
    return this.getDay(time.getDate());
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
