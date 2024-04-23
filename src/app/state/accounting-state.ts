import { DateState } from "./date-state";
import { MonthState } from "./month-state";

export interface AccountingState {

    readonly months: MonthState[];
    readonly overhours: number;
    readonly activeDay: DateState | undefined;
    readonly currentTime: number;
}