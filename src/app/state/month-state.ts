import { DayState } from "./day-state";

export interface MonthState {

    readonly year: number;
    readonly month: number;
    readonly days: DayState[];
    readonly workedHours: number;
    readonly overhours: number;
}