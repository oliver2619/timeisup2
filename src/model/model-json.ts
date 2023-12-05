import { MonthJson } from "./month-json";
import { ProjectJson } from "./project-json";
import { SettingsJson } from "./settings-json";

export interface ActiveJson {
    readonly day: number;
    readonly month: number;
    readonly year: number;
}

export interface ModelJson {

    readonly version: 1;
    readonly settings: SettingsJson;
    readonly projects: { [key: string]: ProjectJson };
    readonly months: MonthJson[];
    readonly active: ActiveJson | undefined;
    readonly overtime: number;
}