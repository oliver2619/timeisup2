import { AggregatedRecordings } from "./aggregated-recordings";
import { MonthJson } from "./month-json";
import { Project } from "./project";
import { ReadonlyRecord } from "./readonly-record";
import { Task } from "./task";
import { Workingday } from "./workingday";
import { DayOfWeek } from "./dayofweek";
import { DateJson } from "./date-json";

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

  get activeRecord(): ReadonlyRecord | undefined {
    const day = this._activeDay == undefined ? this.getDayByDate(new Date()) : this._activeDay;
    return day?.activeRecord;
  }

  get days(): number[] {
    return this._days.map(it => it.day);
  }

  get isCurrent(): boolean {
    const today = new Date();
    return this.year === today.getFullYear() && this.month === today.getMonth();
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

  canJoinDayRecordWithPrevious(day: number, index: number): boolean {
    return this.getDay(day)?.canJoinDayRecordWithPrevious(index) ?? false;
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

  getOverhoursOfMonth(daysOfWeek: DayOfWeek[], hoursPerDay: number): number {
    const regularDays = this._days.filter(day => {
      const date = new Date();
      date.setTime(0);
      date.setFullYear(this.year, this.month, day.day);
      return daysOfWeek.indexOf(date.getDay()) >= 0;
    });
    const worked = this._days.map(day => day.workedHours).reduce((prev, cur) => cur + prev, 0);
    const holidays = regularDays.map(day => day.holiday).reduce((prev, cur) => cur + prev, 0) * hoursPerDay;
    const mustHaveWorked = (regularDays.length + this.getUnrecordedDays(daysOfWeek, false).length) * hoursPerDay;
    return worked + holidays - mustHaveWorked;
  }

  getUnrecordedDays(daysOfWeek: DayOfWeek[], includeFuture: boolean): number[] {
    const date = new Date();
    const currentDay = date.getDate();
    date.setTime(0);
    date.setFullYear(this.year, this.month, 1);
    const ret: number[] = [];
    const current = this.isCurrent;
    while (date.getMonth() == this.month && (!current || date.getDate() <= currentDay || includeFuture)) {
      if (!this.hasRecordings(date.getDate()) && daysOfWeek.indexOf(date.getDay()) >= 0) {
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

  isDayComplete(day: number): boolean {
    return this.getDay(day)?.isDayComplete ?? false;
  }

  isProjectInUse(name: string): boolean {
    return this._days.some(it => it.isProjectInUse(name)) || (this._activeDay?.isProjectInUse(name) ?? false);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this._days.some(it => it.isTaskInUse(project, task)) || (this._activeDay?.isTaskInUse(project, task) ?? false);
  }

  joinDayRecordWithPrevious(day: number, index: number) {
    this.getDayOrThrowError(day).joinDayRecordWithPrevious(index);
  }

  loadActiveDay(json: DateJson) {
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

  saveActiveDay(): DateJson | undefined {
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
    this.getDayOrThrowError(day).setRecord(index, start, end, task);
  }

  setComment(time: Date, comment: string) {
    if (this._activeDay == undefined) {
      this.getOrCreateDayByDate(time).comment = comment;
    } else {
      this._activeDay.comment = comment;
    }
  }

  splitDayRecord(day: number, index: number) {
    this.getDayOrThrowError(day).splitDayRecord(index);
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

  getDayOrThrowError(day: number): Workingday {
    const d = this.getDay(day);
    if (d == undefined) {
      throw new Error(`Day ${this.year}-${this.month}-${day} not found`);
    }
    return d;
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
