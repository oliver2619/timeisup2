import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectSettingsState } from "../state/project-settings-state";
import { TaskState } from "../state/task-state";

export type TasksByProject = { [key: string]: ReadonlyArray<TaskState> };

export const selectProjectSettings = createSelector(
    createFeatureSelector<ProjectSettingsState>('projectSettings'),
    (state: ProjectSettingsState) => state
);

export const selectProjects = createSelector(
    createFeatureSelector<ProjectSettingsState>('projectSettings'),
    (state: ProjectSettingsState) => Object.values(state.projects).sort((p1, p2) => p1.name.localeCompare(p2.name))
);

export const selectActiveProjects = createSelector(
    createFeatureSelector<ProjectSettingsState>('projectSettings'),
    (state: ProjectSettingsState) => Object.values(state.projects).filter(project => project.useable).sort((p1, p2) => p1.name.localeCompare(p2.name))
);

export const selectTasksByProject = createSelector(
    createFeatureSelector<ProjectSettingsState>('projectSettings'),
    (state: ProjectSettingsState) => {
        const ret: TasksByProject = {};
        Object.values(state.projects).forEach(p => {
            ret[p.name] = Object.values(p.tasks).sort((t1, t2) => t1.name.localeCompare(t2.name));
        });
        return ret;
    }
);

export const selectActiveTasksByProject = createSelector(
    createFeatureSelector<ProjectSettingsState>('projectSettings'),
    (state: ProjectSettingsState) => {
        const ret: TasksByProject = {};
        Object.values(state.projects).forEach(p => {
            ret[p.name] = Object.values(p.tasks).filter(t => t.useable).sort((t1, t2) => t1.name.localeCompare(t2.name));
        });
        return ret;
    }
);