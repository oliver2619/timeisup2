import {Project} from "./project";
import {ReadonlyRecord} from "./readonly-record";
import {RecordJson} from "./record-json";
import {Task} from "./task";

export class Record {

  get currentDurationHours(): number {
    const end = this.end ?? new Date();
    return (end.getTime() - this.start.getTime()) / 3600_000;
  }

  get completedDurationHours(): number {
    return this.end == undefined ? 0 : (this.end.getTime() - this.start.getTime()) / 3600_000;
  }

  get isCompleted(): boolean {
    return this.end != undefined;
  }

  get readonlyRecord(): ReadonlyRecord {
    const start = new Date();
    start.setTime(this.start.getTime());
    const end = this.end == undefined ? undefined : new Date();
    if (this.end != undefined) {
      end?.setTime(this.end.getTime());
    }
    const ret: ReadonlyRecord = {
      start,
      end,
      project: this.task.project.name,
      task: this.task.name
    };
    return ret;
  }

  setRecord(start: Date, end: Date | undefined, task: Task) {
    this.start = new Date();
    this.start.setTime(start.getTime());
    this.end = end == undefined ? undefined : new Date();
    if (end != undefined) {
      this.end?.setTime(end.getTime());
    }
    this.task = task;
  }

  private constructor(public start: Date, public end: Date | undefined, public task: Task) {
  }

  static load(json: RecordJson, projectsByName: (project: string) => Project): Record {
    const project = projectsByName(json.project);
    const task = project.getTask(json.task);
    const start = new Date(Date.parse(json.start));
    const end = json.end == undefined ? undefined : new Date(Date.parse(json.end));
    return new Record(start, end, task);
  }

  static newInstance(start: Date, task: Task): Record {
    return new Record(start, undefined, task);
  }

  isProjectInUse(name: string): boolean {
    return this.task.project.name === name;
  }

  isTaskInUse(project: string, task: string): boolean {
    return this.task.project.name === project && this.task.name === task;
  }

  save(): RecordJson {
    return {
      start: this.start.toISOString(),
      end: this.end == undefined ? undefined : this.end.toISOString(),
      project: this.task.project.name,
      task: this.task.name
    };
  }

  stop(time: Date, onStopTask: (task: Task) => void) {
    if (this.end == undefined) {
      this.end = time;
      onStopTask(this.task);
    }
  }
}
