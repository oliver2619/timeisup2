import { Project } from "./project";
import { Month } from "./month";
import { ModelJson } from "./model-json";
import { ProjectJson } from "./project-json";
import { ReadonlyRecord } from "./readonly-record";
import { AggregatedRecordings } from "./aggregated-recordings";
import { ReadonlyDay } from "./readonly-day";
import { Task } from "./task";
import { DayOfWeek } from "./dayofweek";
import { DateJson } from "./date-json";

export class Model {

  get activeRecord(): ReadonlyRecord | undefined {
    const month = this.activeMonth == undefined ? this.getMonthByDate(new Date()) : this.activeMonth;
    return month?.activeRecord;
  }

  get isRecording(): boolean {
    return this.activeMonth != undefined;
  }

  get months(): number[] {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return this._months.filter(it => it.year === year || (it.year === year - 1 && it.month > month)).map(it => it.month);
  }

  private constructor(
    private readonly _months: Month[],
    private activeMonth: Month | undefined,
    private readonly projectsByName: Map<string, Project>,
    private _overtime: number,
    private _favoriteProject: Project | undefined
  ) {
  }

  static load(json: ModelJson): Model {
    const projects = new Map<string, Project>();
    const projectsByName = (name: string) => {
      const ret = projects.get(name);
      if (ret == undefined) {
        throw new RangeError(`Project ${name} not found`);
      }
      return ret;
    };
    const months = json.months.map(it => Month.load(it, projectsByName));
    const activeMonth = json.active == undefined ? undefined : months.find(it => it.month === json.active?.month && it.year === json.active?.year);
    if (activeMonth != undefined && json.active != undefined) {
      activeMonth.loadActiveDay(json.active);
    }
    const favoriteProject = json.favoriteProject == undefined ? undefined : projects.get(json.favoriteProject);
    return new Model(months, activeMonth, projects, json.overtime, favoriteProject);
  }

  static newInstance(): Model {
    return new Model([], undefined, new Map<string, Project>(), 0, undefined);
  }

  getDayComment(year: number, month: number, day: number): string {
    return this.getMonth(year, month)?.getComment(day) ?? '';
  }

  getDayHoliday(year: number, month: number, day: number): number {
    return this.getMonth(year, month)?.getDayHoliday(day) ?? 0;
  }

  getDayRecords(year: number, month: number, day: number): ReadonlyRecord[] {
    return this.getMonth(year, month)?.getDayRecords(day) ?? [];
  }

  getOverhours(workingDays: DayOfWeek[], hoursPerDay: number): number {
    return this.getRecordedMonthsOverhours(workingDays, hoursPerDay) + this._overtime;
  }

  getOverhoursOfMonth(year: number, month: number, workingDays: DayOfWeek[], hoursPerDay: number): number {
    return this.getMonth(year, month)?.getOverhoursOfMonth(workingDays, hoursPerDay) ?? 0;
  }

  getRecordedDays(year: number, month: number): number[] {
    const m = this.getMonth(year, month);
    if (m == undefined) {
      return [];
    }
    return m.days;
  }

  getRecordedMonths(year: number): number[] {
    const ret = new Set<number>();
    this._months.filter(it => it.year === year).forEach(it => ret.add(it.month));
    return Array.from(ret);
  }

  getUnrecordedDays(year: number, month: number, workingDays: DayOfWeek[]): number[] {
    const m = this.getMonth(year, month);
    if (m == undefined) {
      return [];
    }
    return m.getUnrecordedDays(workingDays, true);
  }

  getWorkedHours(year: number, month: number, day: number): number {
    return this.getMonth(year, month)?.getWorkedHours(day) ?? 0;
  }

  hasRecordings(year: number, month: number, day: number): boolean {
    return this.getMonth(year, month)?.hasRecordings(day) ?? false;
  }

  isDayComplete(year: number, month: number, day: number): boolean {
    return this.getMonth(year, month)?.isDayComplete(day) ?? false;
  }

  isProjectInUse(name: string): boolean {
    return this._months.some(it => it.isProjectInUse(name)) || (this.activeMonth?.isProjectInUse(name) ?? false);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this._months.some(it => it.isTaskInUse(project, task)) || (this.activeMonth?.isTaskInUse(project, task) ?? false);
  }

  joinDayRecordWithPrevious(year: number, month: number, day: number, index: number) {
    this.getMonthOrThrowError(year, month).joinDayRecordWithPrevious(day, index);
  }

  removeDayRecord(year: number, month: number, day: number, index: number) {
    const m = this.getMonth(year, month);
    if (m != undefined) {
      m.removeDayRecord(day, index);
      if (m.isEmpty) {
        this.removeMonth(m);
      }
    }
  }

  removeDayRecords(year: number, month: number, day: number) {
    const m = this.getMonth(year, month);
    if (m != undefined) {
      m.removeDayRecords(day);
      if (m.isEmpty) {
        this.removeMonth(m);
      }
    }
  }

  removeMonthRecords(year: number, month: number, keepOvertime: boolean, workingDays: DayOfWeek[], hoursPerDay: number) {
    const found = this.getMonth(year, month);
    if (found != undefined) {
      if (keepOvertime) {
        const overtime = found.getOverhoursOfMonth(workingDays, hoursPerDay);
        this._overtime += overtime;
      }
      this.removeMonth(found);
    }
  }

  save(): ModelJson {
    const projects: { [key: string]: ProjectJson } = {};
    Array.from(this.projectsByName.values()).forEach(it => projects[it.name] = it.save());
    const active: DateJson | undefined = this.activeMonth == undefined ? undefined : this.activeMonth.saveActiveDay();
    return {
      months: this._months.map(it => it.save()),
      overtime: this._overtime,
      version: 1,
      active
    };
  }

  setDayComment(year: number, month: number, day: number, comment: string) {
    this.getMonthOrThrowError(year, month).setDayComment(day, comment);
  }

  setDayHoliday(year: number, month: number, day: number, holiday: number) {
    if (holiday > 0) {
      this.markDayAsHoliday(year, month, day, holiday);
    } else {
      this.removeHoliday(year, month, day);
    }
  }

  setDayRecord(year: number, month: number, day: number, index: number, start: Date, end: Date | undefined, project: string, task: string) {
    this.getMonthOrThrowError(year, month).setDayRecord(day, index, start, end, this.getProject(project).getTask(task));
  }

  setOverhours(hours: number, workingDays: DayOfWeek[], hoursPerDay: number) {
    this._overtime = hours - this.getRecordedMonthsOverhours(workingDays, hoursPerDay);
  }

  splitDayRecord(year: number, month: number, day: number, index: number) {
    this.getMonthOrThrowError(year, month).splitDayRecord(day, index);
  }

  startTask(project: string, task: string, onStopTask: (task: Task) => void) {
    const today = new Date();
    today.setSeconds(0);
    today.setMilliseconds(0);
    this.getOrCreateActiveMonth(today).startTask(today, this.getProject(project).getTask(task), onStopTask);
  }

  stop(onStopTask: (task: Task) => void) {
    this.activeMonth?.stop(onStopTask);
    this.activeMonth = undefined;
  }

  private getOrCreateActiveMonth(today: Date): Month {
    if (this.activeMonth != undefined) {
      return this.activeMonth;
    }
    const month = this.getOrCreateMonthByDate(today);
    this.activeMonth = month;
    return month;
  }

  private getOrCreateMonth(year: number, month: number): Month {
    const found = this.getMonth(year, month);
    if (found != undefined) {
      return found;
    }
    const newMonth = Month.newInstance(month, year);
    this._months.push(newMonth);
    return newMonth;
  }

  private getOrCreateMonthByDate(today: Date): Month {
    return this.getOrCreateMonth(today.getFullYear(), today.getMonth());
  }

  private getMonth(year: number, month: number): Month | undefined {
    return this._months.find(it => it.year === year && it.month === month);
  }

  private getMonthByDate(today: Date): Month | undefined {
    return this.getMonth(today.getFullYear(), today.getMonth());
  }

  private getMonthOrThrowError(year: number, month: number): Month {
    const m = this.getMonth(year, month);
    if (m == undefined) {
      throw new Error('Month ${year}-${month} not found');
    }
    return m;
  }

  private getProject(name: string): Project {
    const p = this.projectsByName.get(name);
    if (p == undefined) {
      throw new RangeError(`Project ${name} does not exist`);
    }
    return p;
  }

  private getRecordedMonthsOverhours(workingDays: DayOfWeek[], hoursPerDay: number): number {
    return this._months.map(it => it.getOverhoursOfMonth(workingDays, hoursPerDay)).reduce((prev, cur) => cur + prev, 0);
  }

  private markDayAsHoliday(year: number, month: number, day: number, holiday: number) {
    const found = this.getOrCreateMonth(year, month);
    found.markDayAsHoliday(day, holiday);
  }

  private removeHoliday(year: number, month: number, day: number) {
    const found = this.getMonth(year, month);
    if (found != undefined) {
      found.removeHoliday(day);
      if (found.isEmpty) {
        this.removeMonth(found);
      }
    }
  }

  private removeMonth(month: Month) {
    const found = this._months.indexOf(month);
    if (found >= 0) {
      this._months.splice(found, 1);
      if (this.activeMonth === month) {
        this.activeMonth = undefined;
      }
    }
  }
}
