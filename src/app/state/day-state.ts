import { RecordState } from "./record-state";

export interface DayState {

    readonly day: number;
    readonly comment: string;
    readonly absence: number;
    readonly records: RecordState[];
    readonly workedHours: number;
    readonly pausedHours: number;
    readonly accounted: boolean;
    readonly active: boolean;
    readonly future: boolean;
}