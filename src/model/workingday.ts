import {Task} from "./task";
import {Record} from "./record";

export class Workingday {

  constructor(public day: number, public readonly records: Record[]) {
  }

  start(time: Date, task: Task){
    console.warn('Not implemented yet');
  }

  stop() {
    console.warn('Not implemented yet');
  }
}
