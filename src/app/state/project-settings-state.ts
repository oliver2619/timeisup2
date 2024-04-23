import { ProjectState } from "./project-state";

export interface ProjectSettingsState {

    readonly projects: {[key: string]: ProjectState};
    readonly favoriteProject: string | undefined;
}