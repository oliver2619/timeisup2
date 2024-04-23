import { RecordJson } from "../../model/record-json";
import { RecordState } from "../state/record-state";
import { Settings } from "./settings";
import { Task } from "./task";

export class Record {

    get isActive(): boolean {
        return this._endDate == undefined;
    }

    get endTime(): number | undefined {
        return this._endDate?.getTime();
    }

    get startTime(): number {
        return this._startDate.getTime();
    }

    private constructor(private _startDate: Date, private _endDate: Date | undefined, private task: Task) { }

    static load(json: RecordJson): Record {
        return new Record(new Date(Date.parse(json.start)), json.end == undefined ? undefined : new Date(Date.parse(json.end)), new Task(json.project, json.task));
    }

    static start(task: Task, currentTime: Date): Record {
        return new Record(new Date(currentTime), undefined, task);
    }

    canJoinWith(other: Record): boolean {
        return this.task.isSame(other.task);
    }

    getWorkedHours(currentTime: Date): number {
        const end = this._endDate ?? currentTime;
        return (end.getTime() - this._startDate.getTime()) / 3600_000;
    }

    getRecordState(currentTime: Date): RecordState {
        return {
            endTime: this._endDate?.getTime(),
            hours: this.getWorkedHours(currentTime),
            project: this.task.project,
            startTime: this._startDate.getTime(),
            task: this.task.name
        }
    }

    isProjectInUse(project: string): boolean {
        return this.task.project === project;
    }

    isTaskInUse(project: string, task: string): boolean {
        return this.task.project === project && this.task.name === task;
    }

    joinWithNext(other: Record) {
        this._endDate = other._endDate;
    }

    renameProject(project: string, newName: string) {
        if (this.task.project === project) {
            this.task = new Task(newName, this.task.name);
        }
    }

    renameTask(project: string, task: string, newName: string) {
        if (this.task.project === project && this.task.name === task) {
            this.task = new Task(project, newName);
        }
    }

    save(): RecordJson {
        return {
            end: this._endDate?.toISOString(),
            project: this.task.project,
            start: this._startDate.toISOString(),
            task: this.task.name
        };
    }

    setRecord(task: Task, startDate: Date, endDate: Date | undefined) {
        this.task = task;
        this._startDate = startDate;
        this._endDate = endDate;
    }

    split(currentTime: Date, settings: Settings): Record {
        const startTime = this._startDate.getTime();
        const endTime = (this._endDate ?? currentTime).getTime();
        const nextEndDate = this._endDate;
        const splitTime = Math.round((startTime + endTime) / 2);
        this._endDate = new Date(splitTime);
        settings.adjustTime(this._endDate);
        const nextStartDate = new Date(splitTime);
        settings.adjustTime(nextStartDate);
        return new Record(nextStartDate, nextEndDate, this.task);
    }

    stopRecording(currentTime: Date) {
        this._endDate = new Date(currentTime);
    }
}