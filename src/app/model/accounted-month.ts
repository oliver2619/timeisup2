import { MonthJson } from "../../model/month-json";
import { WorkingdayJson } from "../../model/workingday-json";
import { DayState } from "../state/day-state";
import { AccountedDay } from "./accounted-day";
import { Dates } from "./dates";
import { Settings } from "./settings";
import { Task } from "./task";

export class AccountedMonth {

    get activeDay(): AccountedDay | undefined {
        return this._activeDay;
    }

    get isActive(): boolean {
        return Array.from(this.days.values()).some(d => d.isActive);
    }

    get isEmpty(): boolean {
        return this.days.size === 0;
    }

    private constructor(readonly year: number, readonly month: number, private readonly days: Map<number, AccountedDay>, private _activeDay: AccountedDay | undefined) { }

    static newInstance(year: number, month: number): AccountedMonth {
        return new AccountedMonth(year, month, new Map<number, AccountedDay>(), undefined);
    }

    deleteDay(day: number) {
        this.days.delete(day);
        this.ensureActiveDayExists();
    }

    deleteRecord(day: number, recordIndex: number) {
        const d = this._getDay(day);
        d.deleteRecord(recordIndex);
        if (d.isEmpty) {
            this.days.delete(day);
        }
        this.ensureActiveDayExists();
    }

    getDayStates(currentTime: Date, settings: Settings): DayState[] {
        const unrecorded: DayState[] = this.getUnrecordedDays(settings, true, currentTime).map(day => ({
            absence: 0,
            comment: '',
            day,
            pausedHours: 0,
            records: [],
            workedHours: 0,
            accounted: false,
            active: false,
            future: currentTime.getFullYear() === this.year && currentTime.getMonth() === this.month && currentTime.getDate() < day
        }));
        const recorded = Array.from(this.days.values()).map(day => day.getDayState(currentTime));
        const ret = [...unrecorded, ...recorded];
        ret.sort((d1, d2) => d1.day - d2.day);
        return ret;
    }

    getOverhours(currentTime: Date, settings: Settings): number {
        const days = Array.from(this.days.values());
        const regularDays = days.filter(day => settings.isDateWorkingDay(Dates.fromDay(day.year, day.month, day.day)));
        const worked = days.map(day => day.getWorkedHours(currentTime)).reduce((prev, cur) => cur + prev, 0);
        const absences = regularDays.map(day => day.absence).reduce((prev, cur) => cur + prev, 0) * settings.hoursPerDay;
        const mustHaveWorked = (regularDays.length + this.getUnrecordedDays(settings, false, currentTime).length) * settings.hoursPerDay;
        return worked + absences - mustHaveWorked;
    }

    getWorkedHours(currentTime: Date): number {
        return Array.from(this.days.values()).reduce((prev, cur) => prev + cur.getWorkedHours(currentTime), 0);
    }

    isProjectInUse(project: string): boolean {
        return Array.from(this.days.values()).some(d => d.isProjectInUse(project));

    }

    isTaskInUse(project: string, task: string): boolean {
        return Array.from(this.days.values()).some(d => d.isTaskInUse(project, task));
    }

    joinRecordWithPrevious(day: number, recordIndex: number) {
        this._getDay(day).joinRecordWithPrevious(recordIndex);
    }

    loadDays(json: WorkingdayJson[]) {
        json.forEach(d => this.getOrCreateDay(d.day).load(d));
        this._activeDay = Array.from(this.days.values()).find(it => it.isActive);
    }

    renameProject(project: string, newName: string) {
        this.days.forEach(d => d.renameProject(project, newName));
    }

    renameTask(project: string, task: string, newName: string) {
        this.days.forEach(d => d.renameTask(project, task, newName));
    }

    save(): MonthJson {
        return {
            year: this.year,
            month: this.month,
            days: Array.from(this.days.values()).map(d => d.save())
        }
    }

    setAbsence(day: number, absence: number) {
        const d = this.getOrCreateDay(day);
        d.setAbsence(absence);
        if (d.isEmpty) {
            this.days.delete(day);
        }
    }

    setCommentToDay(day: number, comment: string) {
        const d = this.getOrCreateDay(day);
        d.setComment(comment);
        if (d.isEmpty) {
            this.days.delete(day);
        }
    }

    setRecord(day: number, recordIndex: number, task: Task, startDate: Date, endDate: Date | undefined) {
        this._getDay(day).setRecord(recordIndex, task, startDate, endDate);
    }

    splitRecord(day: number, recordIndex: number, currentTime: Date, settings: Settings) {
        this._getDay(day).splitRecord(recordIndex, currentTime, settings);
    }

    startRecording(task: Task, currentTime: Date) {
        this.getOrCreateActiveDay(currentTime).startRecording(task, currentTime);
    }

    stopRecording(currentTime: Date) {
        this.getActiveDay().stopRecording(currentTime);
        this._activeDay = undefined;
    }

    private ensureActiveDayExists() {
        if (this._activeDay != undefined) {
            const day = this.days.get(this._activeDay.day);
            if (day == undefined || !day.isActive) {
                this._activeDay = undefined;
            }
        }
    }

    private getActiveDay(): AccountedDay {
        if (this._activeDay == undefined) {
            throw new Error(`No active day found in ${this.year}-${this.month}`);
        }
        return this._activeDay;
    }

    private _getDay(day: number): AccountedDay {
        const ret = this.days.get(day);
        if (ret == undefined) {
            throw new RangeError(`Day ${day} not found in month ${this.month}`);
        }
        return ret;
    }

    private getOrCreateActiveDay(currentTime: Date): AccountedDay {
        if (this._activeDay == undefined) {
            this._activeDay = this.getOrCreateDay(currentTime.getDate());
        }
        return this._activeDay;
    }

    private getOrCreateDay(day: number): AccountedDay {
        const existingDay = this.days.get(day);
        if (existingDay == undefined) {
            const newDay = AccountedDay.newInstance(this.year, this.month, day);
            this.days.set(day, newDay);
            return newDay;
        } else {
            return existingDay;
        }
    }

    private getUnrecordedDays(settings: Settings, includeFuture: boolean, currentTime: Date): number[] {
        const currentDay = currentTime.getDate();
        const date = Dates.fromDay(this.year, this.month, 1);
        const ret: number[] = [];
        const current = currentTime.getFullYear() === this.year && currentTime.getMonth() === this.month;
        while (date.getMonth() == this.month && (!current || date.getDate() <= currentDay || includeFuture)) {
            if (!this.days.has(date.getDate()) && settings.isDateWorkingDay(date)) {
                ret.push(date.getDate());
            }
            date.setDate(date.getDate() + 1);
        }
        return ret;
    }

}