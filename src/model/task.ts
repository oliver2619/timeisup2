import { Project } from "./project";
import { TaskJson } from "./task-json";

export class Task {

  private constructor(public name: string, public readonly project: Project) {
  }

  static load(name: string, json: TaskJson, project: Project): Task {
    return new Task(name, project);
  }

  static newInstance(name: string, project: Project): Task {
    return new Task(name, project);
  }

  save(): TaskJson {
    return {};
  }
}
