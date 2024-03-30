import { Task } from "./task";
import { Record } from "./record";
import { WorkingdayJson } from "./workingday-json";
import { Project } from "./project";
import { ReadonlyRecord } from "./readonly-record";
import { AggregatedRecordings } from "./aggregated-recordings";
import { AggregatedRecordingsBuilder } from "./aggregated-recordings-builder";

export class Workingday {

  get activeRecord(): ReadonlyRecord | undefined {
    const incomplete = this.records.filter(it => !it.isCompleted);
    return incomplete.length > 0 ? incomplete[incomplete.length - 1].readonlyRecord : undefined;
  }

  get isDayComplete(): boolean {
    return this.records.every(it => it.isCompleted);
  }

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
    return new Workingday(json.day, json.comment ?? '', records, json.holiday ?? 0);
  }

  static newInstance(day: number): Workingday {
    return new Workingday(day, '', [], 0);
  }

  canJoinDayRecordWithPrevious(index: number): boolean {
    return index > 0 && this.records[index].canJoinWith(this.records[index - 1]);
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

  joinDayRecordWithPrevious(index: number) {
    if (!this.canJoinDayRecordWithPrevious(index)) {
      throw new RangeError(`Recording can not be joined with previous`);
    }
    this.records[index - 1].end = this.records[index].end;
    this.records.splice(index, 1);
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
    this.sortByStartTime();
  }

  splitDayRecord(index: number) {
    const newRecord = this.records[index].split();
    this.records.splice(index + 1, 0, newRecord);
  }

  start(time: Date, task: Task, onStopTask: (task: Task) => void) {
    this.records.forEach(it => it.stop(time, onStopTask));
    this.records.push(Record.newInstance(time, task));
    this.sortByStartTime();
  }

  stop(onStopTask: (task: Task) => void) {
    const time = new Date();
    time.setSeconds(0);
    time.setMilliseconds(0);
    this.records.forEach(it => it.stop(time, onStopTask));
  }

  private sortByStartTime() {
    this.records.sort((r1, r2) => r1.start.getTime() - r2.start.getTime());
  }
}
