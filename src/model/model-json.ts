import { DateJson } from "./date-json";
import { MonthJson } from "./month-json";
import { ProjectJson } from "./project-json";
import { SettingsJson } from "./settings-json";
export interface ModelJson {

    readonly version: 1;
    readonly settings?: SettingsJson;
    readonly projects?: { [key: string]: ProjectJson };
    readonly months: MonthJson[];
    readonly active: DateJson | undefined;
    readonly overtime: number; // hours
    readonly favoriteProject?: string | undefined;
}

export const modelJsonStorePrefix = 'timeisup2:';