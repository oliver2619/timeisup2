import { DayOfWeek } from "../../model/dayofweek";

export class Settings {

    get hoursPerDay(): number {
        const ds = this.workingDays.size;
        return ds > 0 ? (this._hoursPerWeek * this._pensum / ds) : 0;
    }

    constructor(private _hoursPerWeek: number, private _pensum: number, private readonly workingDays: Set<DayOfWeek>) { }

    adjustTime(date: Date) {
        date.setSeconds(0, 0);
    }

    isDateWorkingDay(date: Date): boolean {
        return this.workingDays.has(date.getDay());
    }
}