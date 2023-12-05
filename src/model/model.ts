import { Settings } from "./settings";
import { Project } from "./project";
import { Month } from "./month";
import { ActiveJson, ModelJson } from "./model-json";
import { ProjectJson } from "./project-json";
import { ReadonlyRecord } from "./readonly-record";
import { AggregatedRecordings } from "./aggregated-recordings";
import { ReadonlyDay } from "./readonly-day";

export class Model {

  get activeDay(): ReadonlyDay {
    if (this.activeMonth == undefined) {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate()
      };
    } else {
      return {
        year: this.activeMonth.year,
        month: this.activeMonth.month,
        day: this.activeMonth.activeDay
      }
    }
  }

  get activeDayAggregatedRecordings(): AggregatedRecordings {
    const month = this.activeMonth == undefined ? this.getMonth(new Date()) : this.activeMonth;
    const ret = month?.activeDayAggregatedRecordings;
    if (ret == undefined) {
      throw new Error('No active day recordings found');
    }
    return ret;
  }

  get activeDayRecords(): ReadonlyRecord[] {
    const month = this.activeMonth == undefined ? this.getMonth(new Date()) : this.activeMonth;
    return month?.activeDayRecords ?? [];
  }

  get comment(): string {
    const today = new Date();
    if (this.activeMonth == undefined) {
      return this.getMonth(today)?.getComment(today) ?? '';
    } else {
      return this.activeMonth.getComment(today);
    }
  }

  set comment(comment: string) {
    const today = new Date();
    if (this.activeMonth == undefined) {
      this.getOrCreateMonth(today).setComment(today, comment);
    } else {
      this.activeMonth.setComment(today, comment);
    }
  }

  get hoursPerWeek(): number {
    return this.settings.hoursPerWeek;
  }

  set hoursPerWeek(v: number) {
    this.settings.hoursPerWeek = v;
  }

  get isRecording(): boolean {
    return this.activeMonth != undefined;
  }

  get maxHoursPerDay(): number {
    return this.settings.maxHoursPerDay;
  }

  set maxHoursPerDay(v: number) {
    this.settings.maxHoursPerDay = v;
  }

  get months(): number[] {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    return this._months.filter(it => it.year === year || (it.year === year - 1 && it.month > month)).map(it => it.month);
  }

  get projects(): string[] {
    return Array.from(this.projectsByName.values()).map(it => it.name);
  }

  get recordedYears(): number[] {
    const ret = new Set<number>();
    this._months.forEach(it => ret.add(it.year));
    return Array.from(ret);
  }

  private constructor(private readonly _months: Month[], private activeMonth: Month | undefined, private readonly settings: Settings, private readonly projectsByName: Map<string, Project>, private _overtime: number) { }

  static load(json: ModelJson): Model {
    const settings = Settings.load(json.settings);
    const projects = new Map<string, Project>();
    Object.entries(json.projects).forEach(it => projects.set(it[0], Project.load(it[0], it[1])));
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
    return new Model(months, activeMonth, settings, projects, json.overtime);
  }

  static newInstance(): Model {
    return new Model([], undefined, Settings.newInstance(), new Map<string, Project>(), 0);
  }

  addProject(name: string) {
    if (this.hasProject(name)) {
      throw new RangeError(`Project ${name} already exists`);
    }
    this.projectsByName.set(name, Project.newInstance(name));
  }

  addTask(project: string, task: string) {
    this.getProject(project).addTask(task);
  }

  getDayAggregatedRecordings(year: number, month: number, day: number): AggregatedRecordings | undefined {
    return this._months.find(it => it.year === year && it.month === month)?.getDayAggregatedRecordings(day);
  }

  getDayRecords(year: number, month: number, day: number): ReadonlyRecord[] {
    return this._months.find(it => it.year === year && it.month === month)?.getDayRecords(day) ?? [];
  }

  getProjectsWithTasks(): string[] {
    return Array.from(this.projectsByName.values()).filter(it => it.hasTasks).map(it => it.name);
  }

  getRecordedDays(year: number, month: number): number[] {
    const m = this._months.find(it => it.year === year && it.month === month);
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

  getTasksForProject(project: string): string[] {
    return this.projectsByName.get(project)?.tasks.map(it => it.name) ?? [];
  }

  getWorkedHours(year: number, month: number, day: number): number {
    return this._months.find(it => it.year === year && it.month === month)?.getWorkedHours(day) ?? 0;
  }

  hasProject(name: string): boolean {
    return this.projectsByName.has(name);
  }

  hasRecordings(year: number, month: number, day: number): boolean {
    return this._months.find(it => it.year === year && it.month === month)?.hasRecordings(day) ?? false;
  }

  hasTask(project: string, task: string): boolean {
    return this.projectsByName.get(project)?.hasTask(task) ?? false;
  }

  isProjectInUse(name: string): boolean {
    return this._months.some(it => it.isProjectInUse(name)) || (this.activeMonth?.isProjectInUse(name) ?? false);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this._months.some(it => it.isTaskInUse(project, task)) || (this.activeMonth?.isTaskInUse(project, task) ?? false);
  }

  removeDayRecord(year: number, month: number, day: number, index: number) {
    const m = this._months.find(it => it.year === year && it.month === month);
    if (m != undefined) {
      m.removeDayRecord(day, index);
      if (m.isEmpty) {
        this.removeMonth(m);
      }
    }
  }

  removeDayRecords(year: number, month: number, day: number) {
    const m = this._months.find(it => it.year === year && it.month === month);
    if (m != undefined) {
      m.removeDayRecords(day);
      if (m.isEmpty) {
        this.removeMonth(m);
      }
    }
  }

  removeMonthRecords(year: number, month: number) {
    const found = this._months.find(it => it.year === year && it.month === month);
    if (found != undefined) {
      this.removeMonth(found);
    }
  }

  removeProject(name: string) {
    if (this.isProjectInUse(name)) {
      throw new RangeError(`Project ${name} is still in use`);
    }
    this.projectsByName.delete(name);
  }

  removeTask(project: string, task: string) {
    if (this.isTaskInUse(project, task)) {
      throw new RangeError(`Task ${task} of project ${project} is still in use`);
    }
    this.getProject(project).removeTask(task);
  }

  renameProject(oldName: string, newName: string) {
    if (this.hasProject(newName)) {
      throw new RangeError(`Project ${newName} already exists`);
    }
    const p = this.getProject(oldName);
    this.projectsByName.delete(oldName);
    p.name = newName;
    this.projectsByName.set(newName, p);
  }

  renameTask(project: string, oldName: string, newName: string) {
    const p = this.getProject(project);
    p.renameTask(oldName, newName);
  }

  save(): ModelJson {
    const projects: { [key: string]: ProjectJson } = {};
    Array.from(this.projectsByName.values()).forEach(it => projects[it.name] = it.save());
    const active: ActiveJson | undefined = this.activeMonth == undefined ? undefined : this.activeMonth.saveActiveDay();
    return {
      months: this._months.map(it => it.save()),
      overtime: this._overtime,
      version: 1,
      settings: this.settings.save(),
      projects,
      active
    };
  }

  setDayRecord(year: number, month: number, day: number, index: number, start: Date, end: Date | undefined, project: string, task: string) {
    const m = this._months.find(it => it.year === year && it.month === month);
    if (m == undefined) {
      throw new Error('Day ${year}-${month}-${day} not found');
    }
    m.setDayRecord(day, index, start, end, this.getProject(project).getTask(task));
  }

  startTask(project: string, task: string) {
    const today = new Date();
    today.setSeconds(0);
    today.setMilliseconds(0);
    this.getOrCreateActiveMonth(today).startTask(today, this.getProject(project).getTask(task));
  }

  stop() {
    this.activeMonth?.stop();
    this.activeMonth = undefined;
  }

  private getOrCreateActiveMonth(today: Date): Month {
    if (this.activeMonth != undefined) {
      return this.activeMonth;
    }
    const month = this.getOrCreateMonth(today);
    this.activeMonth = month;
    return month;
  }

  private getOrCreateMonth(today: Date): Month {
    const year = today.getFullYear();
    const month = today.getMonth();
    const found = this._months.find(it => it.year === year && it.month === month);
    if (found != undefined) {
      return found;
    }
    const newMonth = Month.newInstance(month, year);
    this._months.push(newMonth);
    return newMonth;
  }

  private getMonth(today: Date): Month | undefined {
    const year = today.getFullYear();
    const month = today.getMonth();
    return this._months.find(it => it.year === year && it.month === month);
  }

  private getProject(name: string): Project {
    const p = this.projectsByName.get(name);
    if (p == undefined) {
      throw new RangeError(`Project ${name} does not exist`);
    }
    return p;
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
