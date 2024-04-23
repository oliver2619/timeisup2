import { AccountingJson } from "../../model/accounting-json";
import { ModelJson } from "../../model/model-json";
import { MonthJson } from "../../model/month-json";
import { AccountingState } from "../state/accounting-state";
import { DateState } from "../state/date-state";
import { MonthState } from "../state/month-state";
import { AccountedYear } from "./accounted-year";
import { Settings } from "./settings";
import { Task } from "./task";

export class Accountings {

    private constructor(
        private readonly years: Map<number, AccountedYear>,
        private activeYear: AccountedYear | undefined,
        private overhours: number,
        private currentTime: Date) { }

    static loadFromAccountingJson(json: AccountingJson, settings: Settings): Accountings {
        const years = this.loadMonths(json.months);
        const active = Array.from(years.values()).find(y => y.activeMonth != undefined);
        return new Accountings(years, active, json.overhours, Accountings.createCurrentTime(settings));
    }

    static loadFromModelJson(json: ModelJson, settings: Settings): Accountings {
        const years = this.loadMonths(json.months);
        const active = Array.from(years.values()).find(y => y.activeMonth != undefined);
        return new Accountings(years, active, json.overtime, Accountings.createCurrentTime(settings));
    }

    private static loadMonths(months: MonthJson[]): Map<number, AccountedYear> {
        const ret = new Map<number, AccountedYear>();
        months.forEach(m => {
            const year = ret.get(m.year);
            if (year == undefined) {
                const newYear = AccountedYear.newInstance(m.year);
                ret.set(m.year, newYear);
                newYear.loadMonth(m);
            } else {
                year.loadMonth(m);
            }
        });
        return ret;
    }

    static newInstance(settings: Settings): Accountings {
        return new Accountings(new Map<number, AccountedYear>(), undefined, 0, Accountings.createCurrentTime(settings));
    }

    private static createCurrentTime(settings: Settings): Date {
        const ret = new Date();
        settings.adjustTime(ret);
        return ret;
    }

    deleteDay(year: number, month: number, day: number) {
        const y = this._getYear(year);
        y.deleteDay(month, day);
        if (y.isEmpty) {
            this.years.delete(year);
        }
        this.ensureActiveYearExists();
    }

    deleteMonth(year: number, month: number, keepOvertime: boolean, settings: Settings) {
        const y = this._getYear(year);
        if (keepOvertime) {
            this.overhours += y.getMonthOverhours(month, this.currentTime, settings);
        }
        y.deleteMonth(month);
        if (y.isEmpty) {
            this.years.delete(year);
        }
        this.ensureActiveYearExists();
    }

    deleteRecord(year: number, month: number, day: number, recordIndex: number) {
        const y = this._getYear(year);
        y.deleteRecord(month, day, recordIndex);
        if (y.isEmpty) {
            this.years.delete(year);
        }
        this.ensureActiveYearExists();
    }

    getState(settings: Settings): AccountingState {
        const ret: AccountingState = {
            activeDay: this.getActiveDayToState(),
            currentTime: this.currentTime.getTime(),
            months: this.getMonthStates(settings),
            overhours: this.overhours + this.getAllMonthOverhours(this.currentTime, settings)
        };
        return ret;
    }

    incrementTime(settings: Settings): boolean {
        const nextTime = Accountings.createCurrentTime(settings);
        if (nextTime.getTime() == this.currentTime.getTime()) {
            return false;
        } else {
            this.currentTime = nextTime;
            return true;
        }
    }

    isProjectInUse(project: string): boolean {
        return Array.from(this.years.values()).some(y => y.isProjectInUse(project));
    }

    isTaskInUse(project: string, task: string): boolean {
        return Array.from(this.years.values()).some(y => y.isTaskInUse(project, task));
    }

    joinRecordWithPrevious(year: number, month: number, day: number, recordIndex: number) {
        this._getYear(year).joinRecordWithPrevious(month, day, recordIndex);
    }

    renameProject(project: string, newName: string) {
        this.years.forEach(y => y.renameProject(project, newName));
    }

    renameTask(project: string, task: string, newName: string) {
        this.years.forEach(y => y.renameTask(project, task, newName));
    }

    save(): AccountingJson {
        const json: AccountingJson = {
            version: 1,
            months: this.saveMonths(),
            overhours: this.overhours,
        }
        return json;
    }

    setDayAbsence(year: number, month: number, day: number, absence: number) {
        const y = this.getOrCreateYear(year);
        y.setAbsence(month, day, absence);
        if (y.isEmpty) {
            this.years.delete(year);
        }
    }

    setCommentToCurrentDay(comment: string) {
        this.setCommentToDay(this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(), comment);
    }

    setCommentToDay(year: number, month: number, day: number, comment: string) {
        const y = this.getOrCreateYear(this.currentTime.getFullYear());
        y.setCommentToDay(month, day, comment);
        if (y.isEmpty) {
            this.years.delete(year);
        }
    }

    setOverhours(overhours: number, settings: Settings) {
        this.overhours = overhours - this.getAllMonthOverhours(this.currentTime, settings);
    }

    setRecord(year: number, month: number, day: number, recordIndex: number, task: Task, startDate: Date, endDate: Date | undefined) {
        this._getYear(year).setRecord(month, day, recordIndex, task, startDate, endDate);
    }

    splitRecord(year: number, month: number, day: number, recordIndex: number, settings: Settings) {
        this._getYear(year).splitRecord(month, day, recordIndex, this.currentTime, settings);
    }

    startRecording(task: Task) {
        if (this.activeYear != undefined) {
            this.activeYear.stopRecording(this.currentTime);
        }
        this.getOrCreateActiveYear().startRecording(task, this.currentTime);
    }

    stopRecording() {
        this.getActiveYear().stopRecording(this.currentTime);
        this.activeYear = undefined;
    }

    private ensureActiveYearExists() {
        if (this.activeYear != undefined) {
            const year = this.years.get(this.activeYear.year);
            if (year == undefined || !year.isActive) {
                this.activeYear = undefined;
            }
        }
    }

    private getActiveYear(): AccountedYear {
        if (this.activeYear == undefined) {
            throw new Error('No active year found');
        }
        return this.activeYear;
    }

    private getActiveDayToState(): DateState | undefined {
        const activeDay = this.activeYear?.activeMonth?.activeDay;
        if (activeDay == undefined) {
            return undefined;
        }
        return {
            year: activeDay.year,
            month: activeDay.month,
            day: activeDay.day
        }
    }

    private getAllMonthOverhours(currentTime: Date, settings: Settings): number {
        return Array.from(this.years.values()).reduce((prev, cur) => prev + cur.getAllMonthOverhours(currentTime, settings), 0);
    }

    private getMonthStates(settings: Settings): MonthState[] {
        const ret: MonthState[] = [];
        this.years.forEach(year => year.getStateOfMonths(this.currentTime, settings).forEach(month => ret.push(month)));
        return ret;
    }

    private getOrCreateActiveYear(): AccountedYear {
        if (this.activeYear == undefined) {
            this.activeYear = this.getOrCreateYear(this.currentTime.getFullYear());
        }
        return this.activeYear;
    }

    private getOrCreateYear(year: number): AccountedYear {
        const existingYear = this.years.get(year);
        if (existingYear == undefined) {
            const newYear = AccountedYear.newInstance(year);
            this.years.set(newYear.year, newYear);
            return newYear;
        } else {
            return existingYear;
        }
    }

    private _getYear(year: number): AccountedYear {
        const ret = this.years.get(year);
        if (ret == undefined) {
            throw new RangeError(`Year ${year} not found`);
        }
        return ret;
    }

    private saveMonths(): MonthJson[] {
        const ret: MonthJson[] = [];
        this.years.forEach(year => year.saveMonths().forEach(m => ret.push(m)))
        return ret;
    }
}