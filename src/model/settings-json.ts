export interface SettingsJson {

    readonly maxHoursPerDay: number;
    readonly hoursPerWeek: number;
    readonly pensum?: number;
    readonly daysOfWeek?: number[];
}

export interface SettingsJson2 {

    readonly version: 2;
    readonly maxHoursPerDay: number;
    readonly hoursPerWeek: number;
    readonly pensumPercentage: number;
    readonly workingDays: number[];
}
