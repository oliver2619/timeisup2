import {Settings} from "./settings";
import {Project} from "./project";
import {Month} from "./month";
import {ActiveJson, ModelJson} from "./model-json";
import {ProjectJson} from "./project-json";
import {ReadonlyRecord} from "./readonly-record";
import {AggregatedRecordings} from "./aggregated-recordings";
import {ReadonlyDay} from "./readonly-day";
import {Task} from "./task";
import {DayOfWeek} from "./dayofweek";

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
    const month = this.activeMonth == undefined ? this.getMonthByDate(new Date()) : this.activeMonth;
    const ret = month?.activeDayAggregatedRecordings;
    if (ret == undefined) {
      throw new Error('No active day recordings found');
    }
    return ret;
  }

  get activeDayRecords(): ReadonlyRecord[] {
    const month = this.activeMonth == undefined ? this.getMonthByDate(new Date()) : this.activeMonth;
    return month?.activeDayRecords ?? [];
  }

  get comment(): string {
    const today = new Date();
    if (this.activeMonth == undefined) {
      return this.getMonthByDate(today)?.getCommentByDate(today) ?? '';
    } else {
      return this.activeMonth.getCommentByDate(today);
    }
  }

  set comment(comment: string) {
    const today = new Date();
    if (this.activeMonth == undefined) {
      this.getOrCreateMonthByDate(today).setComment(today, comment);
    } else {
      this.activeMonth.setComment(today, comment);
    }
  }

  get favoriteProject(): string | undefined {
    return this._favoriteProject?.name;
  }

  set favoriteProject(name: string | undefined) {
    if (name == undefined) {
      this._favoriteProject = undefined;
      this.selectFavoriteProject();
    } else {
      const p = this.getProject(name);
      if (p.canBeUsed) {
        this._favoriteProject = p;
      } else {
        throw new RangeError(`Project ${name} can not be used`);
      }
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

  get pensum(): number {
    return this.settings.pensum;
  }

  set pensum(p: number) {
    this.settings.pensum = p;
  }

  get projects(): string[] {
    return Array.from(this.projectsByName.values()).map(it => it.name);
  }

  get recordedYears(): number[] {
    const ret = new Set<number>();
    this._months.forEach(it => ret.add(it.year));
    return Array.from(ret);
  }

  private constructor(
    private readonly _months: Month[],
    private activeMonth: Month | undefined,
    private readonly settings: Settings,
    private readonly projectsByName: Map<string, Project>,
    private _overtime: number,
    private _favoriteProject: Project | undefined
  ) {
  }

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
    const favoriteProject = json.favoriteProject == undefined ? undefined : projects.get(json.favoriteProject);
    return new Model(months, activeMonth, settings, projects, json.overtime, favoriteProject);
  }

  static newInstance(): Model {
    return new Model([], undefined, Settings.newInstance(), new Map<string, Project>(), 0, undefined);
  }

  addProject(name: string) {
    if (this.hasProject(name)) {
      throw new RangeError(`Project ${name} already exists`);
    }
    this.projectsByName.set(name, Project.newInstance(name));
    this.selectFavoriteProject();
  }

  addTask(project: string, task: string) {
    this.getProject(project).addTask(task);
    this.selectFavoriteProject();
  }

  canUseProjectAsFavorite(project: string): boolean {
    const p = this.projectsByName.get(project);
    return p != undefined && p.canBeUsed;
  }

  canUseTaskAsFavorite(project: string, task: string): boolean {
    const p = this.projectsByName.get(project);
    if (p == undefined || !p.canBeUsed) {
      return false;
    }
    return p.canUseTaskAsFavorite(task);
  }

  getDayAggregatedRecordings(year: number, month: number, day: number): AggregatedRecordings | undefined {
    return this.getMonth(year, month)?.getDayAggregatedRecordings(day);
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

  getFavoriteTask(project: string): string | undefined {
    return this.projectsByName.get(project)?.favoriteTask;
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

  getTasksForProject(project: string): string[] {
    return this.projectsByName.get(project)?.tasks.map(it => it.name) ?? [];
  }

  getUnrecordedDays(year: number, month: number): number[] {
    const m = this.getMonth(year, month);
    if (m == undefined) {
      return [];
    }
    return m.getUnrecordedDays(this.settings.daysOfWeek);
  }

  getUsableProjects(): string[] {
    return Array.from(this.projectsByName.values()).filter(it => it.canBeUsed).map(it => it.name);
  }

  getUsableTasksForProject(project: string): string[] {
    return this.projectsByName.get(project)?.usableTasks.map(it => it.name) ?? [];
  }

  getWorkedHours(year: number, month: number, day: number): number {
    return this.getMonth(year, month)?.getWorkedHours(day) ?? 0;
  }

  hasProject(name: string): boolean {
    return this.projectsByName.has(name);
  }

  hasRecordings(year: number, month: number, day: number): boolean {
    return this.getMonth(year, month)?.hasRecordings(day) ?? false;
  }

  hasTask(project: string, task: string): boolean {
    return this.projectsByName.get(project)?.hasTask(task) ?? false;
  }

  isDayOfWeekActive(day: DayOfWeek): boolean {
    return this.settings.isDayOfWeekActive(day);
  }

  isProjectActive(name: string): boolean {
    return this.projectsByName.get(name)?.active ?? false;
  }

  isProjectInUse(name: string): boolean {
    return this._months.some(it => it.isProjectInUse(name)) || (this.activeMonth?.isProjectInUse(name) ?? false);
  }

  isTaskActive(project: string, task: string): boolean {
    const p = this.projectsByName.get(project);
    return p != undefined && p.active && p.isTaskActive(task);
  }

  isTaskInUse(project: string, task: string): boolean {
    return this._months.some(it => it.isTaskInUse(project, task)) || (this.activeMonth?.isTaskInUse(project, task) ?? false);
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

  removeMonthRecords(year: number, month: number) {
    const found = this.getMonth(year, month);
    if (found != undefined) {
      this.removeMonth(found);
    }
  }

  removeProject(name: string) {
    if (this.isProjectInUse(name)) {
      throw new RangeError(`Project ${name} is still in use`);
    }
    this.projectsByName.delete(name);
    this.selectFavoriteProject();
  }

  removeTask(project: string, task: string) {
    if (this.isTaskInUse(project, task)) {
      throw new RangeError(`Task ${task} of project ${project} is still in use`);
    }
    this.getProject(project).removeTask(task);
    this.selectFavoriteProject();
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
      active,
      favoriteProject: this._favoriteProject?.name
    };
  }

  setDayComment(year: number, month: number, day: number, comment: string) {
    const m = this.getMonth(year, month);
    if (m == undefined) {
      throw new Error('Day ${year}-${month}-${day} not found');
    }
    m.setDayComment(day, comment);
  }

  setDayHoliday(year: number, month: number, day: number, holiday: number) {
    if (holiday > 0) {
      this.markDayAsHoliday(year, month, day, holiday);
    } else {
      this.removeHoliday(year, month, day);
    }
  }

  setDayOfWeekActive(day: DayOfWeek, active: boolean) {
    this.settings.setDayOfWeekActive(day, active);
  }

  setDayRecord(year: number, month: number, day: number, index: number, start: Date, end: Date | undefined, project: string, task: string) {
    const m = this.getMonth(year, month);
    if (m == undefined) {
      throw new Error('Day ${year}-${month}-${day} not found');
    }
    m.setDayRecord(day, index, start, end, this.getProject(project).getTask(task));
  }

  setFavoriteTask(project: string, task: string) {
    this.getProject(project).favoriteTask = task;
  }

  setProjectActive(project: string, active: boolean) {
    const p = this.getProject(project);
    p.active = active;
    this.selectFavoriteProject();
  }

  setTaskActive(project: string, task: string, active: boolean) {
    this.getProject(project).setTaskActive(task, active);
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

  private getProject(name: string): Project {
    const p = this.projectsByName.get(name);
    if (p == undefined) {
      throw new RangeError(`Project ${name} does not exist`);
    }
    return p;
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

  private selectFavoriteProject() {
    if (this._favoriteProject != undefined && (!this._favoriteProject.canBeUsed || !this.projectsByName.has(this._favoriteProject.name))) {
      this._favoriteProject = undefined;
    }
    if (this._favoriteProject == undefined) {
      const activeProjects = Array.from(this.projectsByName.values()).filter(it => it.canBeUsed);
      if (activeProjects.length > 0) {
        this._favoriteProject = activeProjects[0];
      }
    }
  }
}
