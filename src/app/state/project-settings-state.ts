import { ProjectState } from "./project-state";

export interface ProjectSettingsState {

    readonly projects: Record<string, ProjectState>;
    readonly favoriteProject: string | undefined;
}