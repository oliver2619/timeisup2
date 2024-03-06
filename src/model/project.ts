import {ProjectJson} from "./project-json";
import {Task} from "./task";
import {TaskJson} from "./task-json";

export class Project {

  active = true;

  private tasksByName = new Map<string, Task>();
  private _favoriteTask: Task | undefined

  get canBeUsed(): boolean {
    return this.active && this.tasksByName.size > 0 && Array.from(this.tasksByName.values()).some(it => it.active);
  }

  get favoriteTask(): string | undefined {
    return this._favoriteTask?.name;
  }

  set favoriteTask(task: string | undefined) {
    if (task == undefined) {
      this._favoriteTask = undefined;
      this.selectFavoriteTask();
    } else {
      const t = this.getTask(task);
      if (t.active) {
        this._favoriteTask = t;
      } else {
        throw new RangeError(`Task ${task} can not be used`);
      }
    }
  }

  get tasks(): Task[] {
    return Array.from(this.tasksByName.values());
  }

  get usableTasks(): Task[] {
    return Array.from(this.tasksByName.values()).filter(it => it.active);
  }

  private constructor(public name: string) {
  }

  static load(name: string, json: ProjectJson): Project {
    const ret = new Project(name);
    ret.active = json.active == undefined ? true : json.active;
    Object.entries(json.tasks).forEach(it => ret.tasksByName.set(it[0], Task.load(it[0], it[1], ret)));
    if (json.favoriteTask != undefined) {
      ret._favoriteTask = ret.tasksByName.get(json.favoriteTask)
    }
    return ret;
  }

  static newInstance(name: string): Project {
    return new Project(name);
  }

  addTask(name: string) {
    if (this.hasTask(name)) {
      throw new RangeError(`Project ${this.name} already has task ${name}`);
    }
    this.tasksByName.set(name, Task.newInstance(name, this));
    this.selectFavoriteTask();
  }

  canUseTaskAsFavorite(name: string): boolean {
    return this.tasksByName.get(name)?.active ?? false;
  }

  getTask(name: string): Task {
    const t = this.tasksByName.get(name);
    if (t == undefined) {
      throw new RangeError(`Project ${this.name} does not have task ${name}`);
    }
    return t;
  }

  hasTask(name: string): boolean {
    return this.tasksByName.has(name);
  }

  isTaskActive(name: string): boolean {
    return this.tasksByName.get(name)?.active ?? false;
  }

  removeTask(name: string) {
    this.tasksByName.delete(name);
    this.selectFavoriteTask();
  }

  renameTask(oldName: string, newName: string) {
    if (this.hasTask(newName)) {
      throw new RangeError(`Project ${this.name} already has task ${newName}`);
    }
    const t = this.getTask(oldName);
    this.tasksByName.delete(oldName);
    t.name = newName;
    this.tasksByName.set(newName, t);
  }

  save(): ProjectJson {
    const tasks: { [key: string]: TaskJson } = {};
    Array.from(this.tasksByName.values()).forEach(it => tasks[it.name] = it.save());
    return {
      tasks,
      active: this.active,
      favoriteTask: this._favoriteTask?.name
    };
  }

  setTaskActive(name: string, active: boolean) {
    this.getTask(name).active = active;
    this.selectFavoriteTask();
  }

  private selectFavoriteTask() {
    if (this._favoriteTask != undefined && (!this._favoriteTask.active || !this.tasksByName.has(this._favoriteTask.name))) {
      this._favoriteTask = undefined;
    }
    if (this._favoriteTask == undefined) {
      const activeTasks = Array.from(this.tasksByName.values()).filter(it => it.active);
      if (activeTasks.length > 0) {
        this._favoriteTask = activeTasks[0];
      }
    }
  }
}
