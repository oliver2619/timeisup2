import { ProjectJson } from "./project-json";
import { Task } from "./task";
import { TaskJson } from "./task-json";

export class Project {

  private tasksByName = new Map<string, Task>();

  get hasTasks(): boolean {
    return this.tasksByName.size > 0;
  }

  get tasks(): Task[] {
    return Array.from(this.tasksByName.values());
  }

  private constructor(public name: string) { }

  static load(name: string, json: ProjectJson): Project {
    const ret = new Project(name);
    Object.entries(json.tasks).forEach(it => ret.tasksByName.set(it[0], Task.load(it[0], it[1], ret)));
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

  removeTask(name: string) {
    this.tasksByName.delete(name);
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
      tasks
    };
  }
}
