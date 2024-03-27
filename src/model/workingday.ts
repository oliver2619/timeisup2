import { Task } from "./task";
import { Record } from "./record";
import { WorkingdayJson } from "./workingday-json";
import { Project } from "./project";
import { ReadonlyRecord } from "./readonly-record";
import { AggregatedRecordings } from "./aggregated-recordings";
import { AggregatedRecordingsBuilder } from "./aggregated-recordings-builder";

export class Workingday {

  get isEmpty(): boolean {
    return this.records.length === 0 && this.comment === '' && this.holiday <= 0;
  }

  get readonlyRecords(): ReadonlyRecord[] {
    return this.records.map(it => it.readonlyRecord);
  }

  get workedHours(): number {
    let ret = 0;
    this.records.forEach(it => {
      if (it.isCompleted) {
        ret += it.completedDurationHours;
      }
    });
    return ret;
  }

  private constructor(public day: number, public comment: string, public readonly records: Record[], public holiday: number) { }

  static load(json: WorkingdayJson, projectsByName: (project: string) => Project): Workingday {
    const records = json.records.map(it => Record.load(it, projectsByName));
    return new Workingday(json.day, json.comment ?? '', records, json.holiday??0);
  }

  static newInstance(day: number): Workingday {
    return new Workingday(day, '', [], 0);
  }

  getDayAggregatedRecordings(): AggregatedRecordings | undefined {
    const builder = new AggregatedRecordingsBuilder(this.comment);
    this.records.forEach(it => builder.add(it));
    return builder.result;
  }

  isProjectInUse(name: string): boolean {
    return this.records.some(it => it.isProjectInUse(name));
  }

  isTaskInUse(project: string, task: string): boolean {
    return this.records.some(it => it.isTaskInUse(project, task));
  }

  removeRecord(index: number) {
    this.records.splice(index, 1);
  }

  save(): WorkingdayJson {
    return {
      day: this.day,
      comment: this.comment.length === 0 ? undefined : this.comment,
      records: this.records.map(it => it.save()),
      holiday: this.holiday
    };
  }

  setRecord(index: number, start: Date, end: Date | undefined, task: Task) {
    const r = this.records[index];
    r.setRecord(start, end, task);
  }

  start(time: Date, task: Task, onStopTask: (task: Task) => void) {
    this.records.forEach(it => it.stop(time, onStopTask));
    this.records.push(Record.newInstance(time, task));
  }

  stop(onStopTask: (task: Task) => void) {
    const time = new Date();
    this.records.forEach(it => it.stop(time, onStopTask));
  }
}
