export interface SettingsJson {

    readonly maxHoursPerDay: number;
    readonly hoursPerWeek: number;
    readonly pensum?: number;
    readonly daysOfWeek?: number[];
}
