import {Task} from "./task";

export class Record {

  constructor(public start: Date, public end: Date | undefined, public task: Task) {
  }
}
