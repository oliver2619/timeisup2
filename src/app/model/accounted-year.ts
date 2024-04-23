import { MonthJson } from "../../model/month-json";
import { MonthState } from "../state/month-state";
import { AccountedMonth } from "./accounted-month";
import { Settings } from "./settings";
import { Task } from "./task";

export class AccountedYear {

    get activeMonth(): AccountedMonth | undefined {
        return this._activeMonth;
    }

    get isActive(): boolean {
        return Array.from(this.months.values()).some(m => m.isActive);
    }

    get isEmpty(): boolean {
        return this.months.size === 0;
    }

    private constructor(readonly year: number, private readonly months: Map<number, AccountedMonth>, private _activeMonth: AccountedMonth | undefined) { }

    static newInstance(year: number): AccountedYear {
        return new AccountedYear(year, new Map<number, AccountedMonth>(), undefined);
    }

    deleteDay(month: number, day: number) {
        const m = this._getMonth(month);
        m.deleteDay(day);
        if (m.isEmpty) {
            this.months.delete(month);
        }
        this.ensureActiveMonthExists();
    }

    deleteMonth(month: number) {
        this.months.delete(month);
        this.ensureActiveMonthExists();
    }

    deleteRecord(month: number, day: number, recordIndex: number) {
        const m = this._getMonth(month);
        m.deleteRecord(day, recordIndex);
        if (m.isEmpty) {
            this.months.delete(month);
        }
        this.ensureActiveMonthExists();
    }

    getAllMonthOverhours(currentTime: Date, settings: Settings): number {
        return Array.from(this.months.values()).reduce((prev, cur) => prev + cur.getOverhours(currentTime, settings), 0);
    }

    getMonthOverhours(month: number, currentTime: Date, settings: Settings): number {
        return this._getMonth(month).getOverhours(currentTime, settings);
    }

    getStateOfMonths(currentTime: Date, settings: Settings): MonthState[] {
        return Array.from(this.months.values()).map(month => ({
            days: month.getDayStates(currentTime, settings),
            month: month.month,
            workedHours: month.getWorkedHours(currentTime),
            year: month.year,
            overhours: month.getOverhours(currentTime, settings)
        }));
    }

    isProjectInUse(project: string): boolean {
        return Array.from(this.months.values()).some(m => m.isProjectInUse(project));

    }

    isTaskInUse(project: string, task: string): boolean {
        return Array.from(this.months.values()).some(m => m.isTaskInUse(project, task));
    }

    joinRecordWithPrevious(month: number, day: number, recordIndex: number) {
        this._getMonth(month).joinRecordWithPrevious(day, recordIndex);
    }

    loadMonth(json: MonthJson) {
        this.getOrCreateMonth(json.month).loadDays(json.days);
        this._activeMonth = Array.from(this.months.values()).find(m => m.activeDay != undefined);
    }

    renameProject(project: string, newName: string) {
        this.months.forEach(m => m.renameProject(project, newName));
    }

    renameTask(project: string, task: string, newName: string) {
        this.months.forEach(m => m.renameTask(project, task, newName));
    }

    saveMonths(): MonthJson[] {
        return Array.from(this.months.values()).map(m => m.save());
    }

    setAbsence(month: number, day: number, absence: number) {
        const m = this.getOrCreateMonth(month);
        m.setAbsence(day, absence);
        if (m.isEmpty) {
            this.months.delete(month);
        }
    }

    setCommentToDay(month: number, day: number, comment: string) {
        const m = this.getOrCreateMonth(month);
        m.setCommentToDay(day, comment);
        if (m.isEmpty) {
            this.months.delete(month);
        }
    }

    setRecord(month: number, day: number, recordIndex: number, task: Task, startDate: Date, endDate: Date | undefined) {
        this._getMonth(month).setRecord(day, recordIndex, task, startDate, endDate);
    }

    splitRecord(month: number, day: number, recordIndex: number, currentTime: Date, settings: Settings) {
        this._getMonth(month).splitRecord(day, recordIndex, currentTime, settings);
    }

    startRecording(task: Task, currentTime: Date) {
        this.getOrCreateActiveMonth(currentTime).startRecording(task, currentTime);
    }

    stopRecording(currentTime: Date) {
        this.getActiveMonth().stopRecording(currentTime);
        this._activeMonth = undefined;
    }

    private ensureActiveMonthExists() {
        if (this._activeMonth != undefined) {
            const m = this.months.get(this._activeMonth.month);
            if (m == undefined || !m.isActive) {
                this._activeMonth = undefined;
            }
        }
    }

    private getActiveMonth(): AccountedMonth {
        if (this._activeMonth == undefined) {
            throw new Error(`No active month found for year ${this.year}`);
        }
        return this._activeMonth;
    }

    private _getMonth(month: number): AccountedMonth {
        const ret = this.months.get(month);
        if (ret == undefined) {
            throw new RangeError(`Month ${month} not found in year ${this.year}`)
        }
        return ret;
    }

    private getOrCreateActiveMonth(currentTime: Date): AccountedMonth {
        if (this._activeMonth == undefined) {
            this._activeMonth = this.getOrCreateMonth(currentTime.getMonth());
        }
        return this._activeMonth;
    }

    private getOrCreateMonth(month: number): AccountedMonth {
        const existingMonth = this.months.get(month);
        if (existingMonth == undefined) {
            const newMonth = AccountedMonth.newInstance(this.year, month);
            this.months.set(newMonth.month, newMonth);
            return newMonth;
        } else {
            return existingMonth;
        }
    }
}