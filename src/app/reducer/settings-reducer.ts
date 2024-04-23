import { createReducer, on } from "@ngrx/store";
import { DayOfWeek } from "../../model/dayofweek";
import { settingsActions } from "../action/settings-actions";
import { SettingsState } from "../state/settings-state";

const initialSettingsState: SettingsState = {
    hoursPerWeek: 42,
    maxHoursPerDay: 12,
    pensumPercentage: 100,
    workingDays: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY]
};

function settingsLoad(_: SettingsState, action: SettingsState): SettingsState {
    return action;
}

export const settingsReducer = createReducer(
    initialSettingsState,
    on(settingsActions.load, settingsLoad),
);