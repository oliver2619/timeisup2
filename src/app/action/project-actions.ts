import { createActionGroup, props } from "@ngrx/store";
import { ProjectSettingsState } from "../state/project-settings-state";

export const projectActions = createActionGroup({
    source: 'Project',
    events: {
        'Load': props<ProjectSettingsState>(),
    }
});