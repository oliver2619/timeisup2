import { DayOfWeek } from "../../model/dayofweek";

export interface SettingsState {

    readonly maxHoursPerDay: number;
    readonly hoursPerWeek: number;
    readonly pensumPercentage: number;
    readonly workingDays: DayOfWeek[];

}