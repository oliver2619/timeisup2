import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SettingsState } from "../state/settings-state";

export const selectSettings = createSelector(
    createFeatureSelector<SettingsState>('settings'),
    (state: SettingsState) => state
);

export const selectWorkingDays = createSelector(
    createFeatureSelector<SettingsState>('settings'),
    (state: SettingsState) => state.workingDays
);

export const selectHoursPerDay = createSelector(
    createFeatureSelector<SettingsState>('settings'),
    (state: SettingsState) => state.workingDays.length > 0 ? state.hoursPerWeek * state.pensumPercentage / (100 * state.workingDays.length) : 0
)