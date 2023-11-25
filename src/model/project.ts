import {Task} from "./task";

export class Project {

  private tasksByName = new Map<string, Task>();

  get tasks(): Task[] {
    return Array.from(this.tasksByName.values());
  }

  constructor(public name: string, tasks: Task[]) {
    tasks.forEach(it => this.tasksByName.set(it.name, it));
  }

  addTask(name: string) {
    if (this.hasTask(name)) {
      throw new RangeError(`Project ${this.name} already has task ${name}`);
    }
    this.tasksByName.set(name, new Task(name, this));
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

  renameTask(oldName: string, newName: string) {
    if (this.hasTask(newName)) {
      throw new RangeError(`Project ${this.name} already has task ${newName}`);
    }
    const t = this.getTask(oldName);
    this.tasksByName.delete(oldName);
    t.name = newName;
    this.tasksByName.set(newName, t);
  }
}
