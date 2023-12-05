import { AggregatedRecordings, AggregatedProjectRecordings } from "./aggregated-recordings";
import { Record } from "./record";
import { Task } from "./task";

export class AggregatedRecordingsBuilder {

    private readonly hoursByProject = new Map<string, number>();
    private readonly hoursByTask = new Map<Task, number>();
    private totalWorkingHours = 0;
    private minDate: Date | undefined;
    private maxDate: Date | undefined;

    constructor(private readonly comment: string) { }

    get result(): AggregatedRecordings {
        if (this.minDate == undefined || this.maxDate == undefined) {
            throw new Error('No recordings have been added');
        }
        const start = new Date();
        start.setTime(this.minDate.getTime());
        const end = new Date();
        end.setTime(this.maxDate.getTime());
        const hoursByProjectAndTask = this.getHoursByProjectAndTask();
        const ret: AggregatedRecordings = {
            start,
            end,
            totalPauseHours: this.getPauseHours(),
            totalWorkingHours: this.totalWorkingHours,
            hoursByProjectAndTask: hoursByProjectAndTask,
            comment: this.comment
        };
        return ret;
    }

    add(record: Record) {
        this.totalWorkingHours += record.currentDurationHours;
        if (this.minDate == undefined || record.start.getTime() < this.minDate.getTime()) {
            this.minDate = record.start;
        }
        const end = record.end ?? new Date();
        if (this.maxDate == undefined || end.getTime() > this.maxDate.getTime()) {
            this.maxDate = end;
        }
        let v = this.hoursByTask.get(record.task);
        if (v == undefined) {
            this.hoursByTask.set(record.task, record.currentDurationHours);
        } else {
            this.hoursByTask.set(record.task, v + record.currentDurationHours);
        }
        v = this.hoursByProject.get(record.task.project.name);
        if (v == undefined) {
            this.hoursByProject.set(record.task.project.name, record.currentDurationHours);
        } else {
            this.hoursByProject.set(record.task.project.name, v + record.currentDurationHours);
        }
    }

    private getPauseHours(): number {
        if (this.minDate != undefined && this.maxDate != undefined) {
            return (this.maxDate.getTime() - this.minDate.getTime()) / 3600_000 - this.totalWorkingHours;
        } else {
            return 0;
        }
    }

    private getHoursByProjectAndTask(): { [key: string]: AggregatedProjectRecordings } {
        const ret: { [key: string]: AggregatedProjectRecordings } = {};
        this.hoursByProject.forEach((totalWorkingHours, project) => {
            ret[project] = {
                totalWorkingHours,
                workingHoursByTask: {}
            };
        });
        this.hoursByTask.forEach((hours, task) => {
            ret[task.project.name].workingHoursByTask[task.name] = hours;
        });
        return ret;
    }
}