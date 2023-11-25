import {Project} from "./project";

export class Task {

  constructor(public name: string, public readonly project: Project) {
  }
}
