import { WorkingdayJson } from "./workingday-json";

export interface MonthJson {

    readonly month: number;
    readonly year: number;
    readonly days: WorkingdayJson[];
}