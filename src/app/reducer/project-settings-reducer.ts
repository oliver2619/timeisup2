import { createReducer, on } from "@ngrx/store";
import _ from "lodash";
import { projectActions } from "../action/project-actions";
import { ProjectSettingsState } from "../state/project-settings-state";

const initialProjectSettingsState: ProjectSettingsState = {
    favoriteProject: undefined,
    projects: {}
};

function loadProjectSettings(_: ProjectSettingsState, action: ProjectSettingsState): ProjectSettingsState {
    return action;
}

export const projectSettingsReducer = createReducer(
    initialProjectSettingsState,
    on(projectActions.load, loadProjectSettings),
);
