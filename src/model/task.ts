import {Project} from "./project";
import {TaskJson} from "./task-json";

export class Task {

  active = true;

  private constructor(public name: string, public readonly project: Project) {
  }

  static load(name: string, json: TaskJson, project: Project): Task {
    const ret = new Task(name, project);
    ret.active = json.active == undefined ? true : json.active;
    return ret;
  }

  static newInstance(name: string, project: Project): Task {
    return new Task(name, project);
  }

  save(): TaskJson {
    return {
      active: this.active
    };
  }
}
