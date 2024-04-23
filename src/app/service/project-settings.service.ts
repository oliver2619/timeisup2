import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import _ from 'lodash';
import { EMPTY, Observable, of } from 'rxjs';
import { ModelJson, modelJsonStorePrefix } from '../../model/model-json';
import { ProjectJson } from '../../model/project-json';
import { ProjectSettingsJson } from '../../model/project-settings-json';
import { TaskJson } from '../../model/task-json';
import { projectActions } from '../action/project-actions';
import { selectProjectSettings } from '../selector/project-settings-selectors';
import { ProjectSettingsState } from '../state/project-settings-state';
import { ProjectState } from '../state/project-state';
import { TaskState } from '../state/task-state';
import { AccountingService } from './accounting.service';

const projectSettingsJsonLocalStoreKey = `${modelJsonStorePrefix}projectSettings`;

@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsService {

  private currentState: ProjectSettingsState = { favoriteProject: undefined, projects: {} };

  constructor(private readonly store: Store, private readonly accountingService: AccountingService) {
    store.select(selectProjectSettings).subscribe({ next: state => this.currentState = state });
  }

  addProject(projectName: string): Observable<boolean> {
    if (this.currentState.projects[projectName] != undefined) {
      throw new Error(`Project ${projectName} already exists`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    newState.projects[projectName] = {
      name: projectName,
      active: true,
      useable: false,
      favorite: false,
      favoriteTask: undefined,
      tasks: {}
    };
    this.applyNewState(newState);
    return of(true);
  }

  addTask(projectName: string, taskName: string): Observable<boolean> {
    if (this.currentState.projects[projectName].tasks[taskName] != undefined) {
      throw new Error(`Task ${taskName} already exists in project ${projectName}`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    newState.projects[projectName].tasks[taskName] = {
      name: taskName,
      active: true,
      favorite: false,
      useable: true
    };
    this.applyNewState(newState);
    return of(true);
  }

  deleteProject(projectName: string): Observable<boolean> {
    if (this.accountingService.isProjectInUse(projectName)) {
      throw new Error(`Project ${projectName} is in use and cannot be deleted.`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    delete newState.projects[projectName];
    this.applyNewState(newState);
    return of(true);
  }

  deleteTask(projectName: string, taskName: string): Observable<boolean> {
    if (this.accountingService.isTaskInUse(projectName, taskName)) {
      throw new Error(`Task ${taskName} in project ${projectName} is in use and cannot be deleted.`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    const tasks = newState.projects[projectName].tasks;
    delete tasks[taskName];
    this.applyNewState(newState);
    return of(true);
  }

  loadProjectSettings(): Observable<ProjectSettingsState> {
    const projectSettingsJson = localStorage.getItem(projectSettingsJsonLocalStoreKey);
    if (projectSettingsJson != null) {
      const settings = JSON.parse(projectSettingsJson) as ProjectSettingsJson;
      const state: ProjectSettingsState = {
        favoriteProject: settings.favoriteProject,
        projects: this.loadProjects(settings.projects)
      };
      return of(this.applyProjectSettingsStateConstraints(state));
    }
    const modelJson = localStorage.getItem(modelJsonStorePrefix);
    if (modelJson != null) {
      const model = JSON.parse(modelJson) as ModelJson;
      if (model.projects != undefined) {
        const state: ProjectSettingsState = {
          favoriteProject: model.favoriteProject,
          projects: this.loadProjects(model.projects)
        };
        return of(this.applyProjectSettingsStateConstraints(state));
      }
    }
    return EMPTY;
  }

  setProject(projectName: string, newName: string, active: boolean): Observable<boolean> {
    if (newName !== projectName && this.currentState.projects[newName] != undefined) {
      throw new Error(`Project ${newName} already exists`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject === projectName ? newName : this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    const project = newState.projects[projectName];
    if (newName !== projectName) {
      delete newState.projects[projectName];
      this.accountingService.renameProject(projectName, newName);
    }
    newState.projects[newName] = {
      ...project,
      name: newName,
      active: active
    };
    this.applyNewState(newState);
    return of(true);
  }

  setProjectFavorite(projectName: string): Observable<boolean> {
    if (!this.currentState.projects[projectName].useable) {
      throw new Error(`Project ${projectName} is not useable as it contains no active tasks or is inactive`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: projectName,
      projects: _.cloneDeep(this.currentState.projects)
    };
    this.applyNewState(newState);
    return of(true);
  }

  setTask(projectName: string, taskName: string, newName: string, active: boolean): Observable<boolean> {
    if (newName !== taskName && this.currentState.projects[projectName].tasks[newName] != undefined) {
      throw new Error(`Task ${newName} already exists in project ${projectName}`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    const project = newState.projects[projectName];
    const task = project.tasks[taskName];
    if (newName !== taskName) {
      delete project.tasks[taskName];
      this.accountingService.renameTask(projectName, taskName, newName);
    }
    const newTask: TaskState = { ...task, active: active, name: newName };
    project.tasks[newName] = newTask;
    newState.projects[projectName] = { ...project, favoriteTask: project.favoriteTask === taskName ? newName : project.favoriteTask };
    this.applyNewState(newState);
    return of(true);
  }

  setTaskFavorite(projectName: string, taskName: string): Observable<boolean> {
    if (!this.currentState.projects[projectName].tasks[taskName].useable) {
      throw new Error(`Task ${taskName} in project ${projectName} is not useable as it is not active`);
    }
    const newState: ProjectSettingsState = {
      favoriteProject: this.currentState.favoriteProject,
      projects: _.cloneDeep(this.currentState.projects)
    };
    const project: ProjectState = { ...newState.projects[projectName], favoriteTask: taskName };
    newState.projects[projectName] = project;
    this.applyNewState(newState);
    return of(true);
  }

  private applyNewState(state: ProjectSettingsState) {
    const constraintState = this.applyProjectSettingsStateConstraints(state);
    this.saveProjectSettings(constraintState);
    this.store.dispatch(projectActions.load(constraintState));
  }

  private applyProjectSettingsStateConstraints(state: ProjectSettingsState): ProjectSettingsState {
    const projects = Object.fromEntries(Object.entries(state.projects).map(([k, v]) => [k, this.applyProjectConstraints(v)]));
    let favoriteProject = state.favoriteProject;
    if (favoriteProject != undefined && (projects[favoriteProject] == undefined || !projects[favoriteProject].useable)) {
      favoriteProject = undefined;
    }
    if (favoriteProject == undefined) {
      favoriteProject = Object.entries(projects).sort((p1, p2) => p1[0].localeCompare(p2[0])).find(([_, v]) => v.useable)?.[0];
    }
    if (favoriteProject != undefined) {
      projects[favoriteProject] = { ...projects[favoriteProject], favorite: true }
    }
    let ret: ProjectSettingsState = {
      favoriteProject,
      projects
    }
    return ret;
  }

  private applyTaskConstraints(state: TaskState): TaskState {
    const ret: TaskState = {
      ...state,
      favorite: false,
      useable: state.active
    };
    return ret;
  }

  private applyProjectConstraints(state: ProjectState): ProjectState {
    const tasks = Object.fromEntries(Object.entries(state.tasks).map(([k, v]) => [k, this.applyTaskConstraints(v)]));
    let favoriteTask = state.favoriteTask;
    if (favoriteTask != undefined && (tasks[favoriteTask] == undefined || !tasks[favoriteTask].useable)) {
      favoriteTask = undefined;
    }
    if (favoriteTask == undefined) {
      favoriteTask = Object.entries(tasks).sort((t1, t2) => t1[0].localeCompare(t2[0])).find(([_, v]) => v.useable)?.[0];
    }
    if (favoriteTask != undefined) {
      tasks[favoriteTask] = { ...tasks[favoriteTask], favorite: true };
    }
    const tasksArray = Object.values(tasks);
    const useable = state.active && tasksArray.length > 0 && tasksArray.some(it => it.useable)
    return {
      ...state,
      favoriteTask,
      favorite: false,
      useable,
      tasks
    };
  }

  private loadProject(name: string, input: ProjectJson): ProjectState {
    const ret: ProjectState = {
      active: input.active ?? true,
      favoriteTask: input.favoriteTask,
      name,
      favorite: false,
      useable: false,
      tasks: Object.fromEntries(Object.entries(input.tasks).map(([k, v]) => [k, this.loadTask(k, v)]))
    };
    return ret;
  }

  private loadProjects(input: { [key: string]: ProjectJson }): { [key: string]: ProjectState } {
    return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, this.loadProject(k, v)]));
  }

  private loadTask(name: string, input: TaskJson): TaskState {
    const ret: TaskState = {
      name,
      favorite: false,
      useable: false,
      active: input.active ?? true
    };
    return ret;
  }

  private saveProjectSettings(state: ProjectSettingsState) {
    const json: ProjectSettingsJson = {
      version: 1,
      favoriteProject: state.favoriteProject,
      projects: Object.fromEntries(Object.entries(state.projects).map(([k, v]) => [k, this.saveProject(v)]))
    };
    localStorage.setItem(projectSettingsJsonLocalStoreKey, JSON.stringify(json));
  }

  private saveProject(state: ProjectState): ProjectJson {
    const ret: ProjectJson = {
      active: state.active,
      favoriteTask: state.favoriteTask,
      tasks: Object.fromEntries(Object.entries(state.tasks).map(([k, v]) => [k, this.saveTask(v)]))
    };
    return ret;
  }

  private saveTask(state: TaskState): TaskJson {
    const ret: TaskJson = {
      active: state.active
    };
    return ret;
  }
}
