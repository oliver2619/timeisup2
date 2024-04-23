import { ProjectJson } from "./project-json";

export interface ProjectSettingsJson {
 
    readonly version: 1;
    readonly projects: { [key: string]: ProjectJson };
    readonly favoriteProject: string | undefined;
}
