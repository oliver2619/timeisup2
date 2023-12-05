import { Task } from "./task";
import { Record } from "./record";
import { WorkingdayJson } from "./workingday-json";
import { Project } from "./project";
import { ReadonlyRecord } from "./readonly-record";
import { AggregatedRecordings } from "./aggregated-recordings";
import { AggregatedRecordingsBuilder } from "./aggregated-recordings-builder";

export class Workingday {

  get isEmpty(): boolean {
    return this.records.length === 0 && this.comment === '';
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

  private constructor(public day: number, public comment: string, public readonly records: Record[]) { }

  static load(json: WorkingdayJson, projectsByName: (project: string) => Project): Workingday {
    const records = json.records.map(it => Record.load(it, projectsByName));
    return new Workingday(json.day, json.comment ?? '', records);
  }

  static newInstance(day: number): Workingday {
    return new Workingday(day, '', []);
  }

  getDayAggregatedRecordings(): AggregatedRecordings {
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
      records: this.records.map(it => it.save())
    };
  }

  setRecord(index: number, start: Date, end: Date | undefined, task: Task) {
    const r = this.records[index];
    r.setRecord(start, end, task);
  }

  start(time: Date, task: Task) {
    this.records.forEach(it => it.stop(time));
    this.records.push(Record.newInstance(time, task));
  }

  stop() {
    const time = new Date();
    this.records.forEach(it => it.stop(time));
  }
}
