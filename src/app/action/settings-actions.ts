import { createActionGroup, props } from "@ngrx/store";
import { DayOfWeek } from "../../model/dayofweek";
import { SettingsState } from "../state/settings-state";

export interface SettingsSetAction {
    readonly maxHoursPerDay: number;
    readonly hoursPerWeek: number;
    readonly pensumPercentage: number;
    readonly workingDays: DayOfWeek[];
    // readonly maximumWorkingHoursPerDay: number;
    // readonly minimumPauseHoursPerDay: number;
}

export const settingsActions = createActionGroup({
    source: 'Settings',
    events: {
        'Load': props<SettingsState>(),
        'Set': props<SettingsSetAction>(),
    }
});