import { WorkingdayJson } from "../../model/workingday-json";
import { DayState } from "../state/day-state";
import { Record } from "./record";
import { Settings } from "./settings";
import { Task } from "./task";

export class AccountedDay {

    get absence(): number {
        return this._absence;
    }

    get comment(): string {
        return this._comment;
    }

    get isActive(): boolean {
        return this.records.some(it => it.isActive);
    }

    get isEmpty(): boolean {
        return this.records.length === 0 && this._comment.length === 0 && this._absence <= 0;
    }

    private constructor(readonly year: number, readonly month: number, readonly day: number, private readonly records: Record[], private _comment: string, private _absence: number) {
        this.sortRecords();
    }

    static newInstance(year: number, month: number, day: number): AccountedDay {
        return new AccountedDay(year, month, day, [], '', 0);
    }

    deleteRecord(recordIndex: number) {
        this.records.splice(recordIndex, 1);
    }

    getDayState(currentTime: Date): DayState {
        return {
            absence: this._absence,
            comment: this._comment,
            day: this.day,
            pausedHours: this.getPausedHours(currentTime),
            records: this.records.map(r => r.getRecordState(currentTime)),
            workedHours: this.getWorkedHours(currentTime),
            accounted: true,
            active: this.records.some(r => r.isActive),
            future: currentTime.getFullYear() === this.year && currentTime.getMonth() === this.month && currentTime.getDate() < this.day
        };
    }

    getPausedHours(currentTime: Date): number {
        return this.getTotalHours(currentTime) - this.getWorkedHours(currentTime);
    }

    getWorkedHours(currentTime: Date): number {
        return this.records.reduce((prev, cur) => prev + cur.getWorkedHours(currentTime), 0);
    }

    getTotalHours(currentTime: Date): number {
        if (this.records.length === 0) {
            return 0;
        }
        return ((this.records[this.records.length - 1].endTime ?? currentTime.getTime()) - this.records[0].startTime) / 3600_000;
    }

    isProjectInUse(project: string): boolean {
        return this.records.some(r => r.isProjectInUse(project));
    }

    isTaskInUse(project: string, task: string): boolean {
        return this.records.some(r => r.isTaskInUse(project, task));
    }

    joinRecordWithPrevious(recordIndex: number) {
        if (!this.canJoinWithPrevious(recordIndex)) {
            throw new RangeError(`Record ${recordIndex} of day ${this.year}-${this.month}-${this.day} cannot be joined with previous because they belong to different tasks.`);
        }
        this.records[recordIndex - 1].joinWithNext(this.records[recordIndex]);
        this.records.splice(recordIndex, 1);
    }

    load(json: WorkingdayJson) {
        this._absence = json.holiday ?? 0;
        this._comment = json.comment ?? '';
        json.records.forEach(r => this.records.push(Record.load(r)));
        this.sortRecords();
    }

    renameProject(project: string, newName: string) {
        this.records.forEach(r => r.renameProject(project, newName));
    }

    renameTask(project: string, task: string, newName: string) {
        this.records.forEach(r => r.renameTask(project, task, newName));
    }

    save(): WorkingdayJson {
        return {
            comment: this._comment,
            day: this.day,
            holiday: this._absence,
            records: this.records.map(r => r.save())
        }
    }

    setAbsence(absence: number) {
        this._absence = absence;
    }

    setComment(comment: string) {
        this._comment = comment;
    }

    setRecord(recordIndex: number, task: Task, startDate: Date, endDate: Date | undefined) {
        this.records[recordIndex].setRecord(task, startDate, endDate);
        this.sortRecords();
    }

    splitRecord(recordIndex: number, currentTime: Date, settings: Settings) {
        const record = this.records[recordIndex];
        const newRecord = record.split(currentTime, settings);
        this.records.splice(recordIndex + 1, 0, newRecord);
    }

    startRecording(task: Task, currentTime: Date) {
        this.records.push(Record.start(task, currentTime));
        this.sortRecords();
    }

    stopRecording(currentTime: Date) {
        this.records.filter(it => it.endTime == undefined).forEach(it => it.stopRecording(currentTime));
    }

    private canJoinWithPrevious(recordIndex: number): boolean {
        if (recordIndex <= 0) {
            return false;
        }
        return this.records[recordIndex].canJoinWith(this.records[recordIndex - 1]);
    }

    private sortRecords() {
        this.records.sort((r1, r2) => r1.startTime - r2.startTime);
    }
}