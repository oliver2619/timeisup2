import { DateJson } from "./date-json";
import { MonthJson } from "./month-json";

export interface AccountingJson {

    readonly version: 1;
    readonly months: MonthJson[];
    readonly overhours: number;

}