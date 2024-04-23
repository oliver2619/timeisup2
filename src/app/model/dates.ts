export class Dates {

    static currentDay(): Date {
        const ret = new Date();
        ret.setHours(0);
        ret.setMinutes(0);
        ret.setSeconds(0, 0);
        return ret;
    }

    static fromDay(year: number, month: number, day: number): Date {
        const ret = new Date();
        ret.setFullYear(year, month, day);
        ret.setHours(0);
        ret.setMinutes(0);
        ret.setSeconds(0, 0);
        return ret;
    }

}