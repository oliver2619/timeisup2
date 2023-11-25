import {Settings} from "./settings";
import {Project} from "./project";
import {Month} from "./month";

export class Model {

  private projectsByName = new Map<string, Project>();
  private activeMonth: Month | undefined;

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

  private constructor(private readonly _months: Month[], private readonly settings: Settings, projects: Project[], private _overtime: number) {
    projects.forEach(it => this.projectsByName.set(it.name, it));
  }

  static newInstance(): Model {
    return new Model([], Settings.newInstance(), [], 0);
  }

  addProject(name: string) {
    if (this.hasProject(name)) {
      throw new RangeError(`Project ${name} already exists`);
    }
    this.projectsByName.set(name, new Project(name, []));
  }

  addTask(project: string, task: string) {
    const p = this.getProject(project);
    p.addTask(task);
  }

  getTasksForProject(project: string): string [] {
    return this.projectsByName.get(project)?.tasks.map(it => it.name) ?? [];
  }

  hasProject(name: string): boolean {
    return this.projectsByName.has(name);
  }

  hasTask(project: string, task: string): boolean {
    return this.projectsByName.get(project)?.hasTask(task) ?? false;
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

  startTask(project: string, task: string) {
    const today = new Date();
    this.getOrCreateActiveMonth(today).startTask(today, this.getProject(project).getTask(task));
  }

  stop() {
    this.activeMonth?.stop();
    this.activeMonth = undefined;
  }

  private getOrCreateActiveMonth(today: Date): Month {
    if(this.activeMonth != undefined) {
      return this.activeMonth;
    }
    const year = today.getFullYear();
    const month = today.getMonth();
    const found = this._months.find(it => it.year === year && it.month === month);
    if(found != undefined) {
      this.activeMonth = found;
      return found;
    }
    const newMonth = new Month(month, year, []);
    this._months.push(newMonth);
    this.activeMonth = newMonth;
    return newMonth;
  }

  private getProject(name: string): Project {
    const p = this.projectsByName.get(name);
    if (p == undefined) {
      throw new RangeError(`Project ${name} does not exist`);
    }
    return p;
  }
}
