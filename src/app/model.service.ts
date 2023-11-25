import {Injectable} from '@angular/core';
import {Model} from "../model/model";

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  private model = Model.newInstance();

  get maxHoursPerDay(): number {
    return this.model.maxHoursPerDay;
  }

  set maxHoursPerDay(v: number) {
    this.model.maxHoursPerDay = v;
    this.save();
  }

  get projects(): string[] {
    return this.model.projects;
  }

  constructor() {
  }

  addProject(name: string) {
    this.model.addProject(name);
    this.save();
  }

  addTask(project: string, task: string) {
    this.model.addTask(project, task);
    this.save();
  }

  getTasksForProject(project: string): string [] {
    return this.model.getTasksForProject(project);
  }

  hasProject(name: string): boolean {
    return this.model.hasProject(name);
  }

  hasTask(project: string, task: string): boolean {
    return this.model.hasTask(project, task);
  }

  removeProject(name: string) {
    console.warn('Not implemented yet');
  }

  removeTask(project: string, task: string) {
    console.warn('Not implemented yet');
  }

  renameProject(oldName: string, newName: string) {
    this.model.renameProject(oldName, newName);
    this.save();
  }

  renameTask(project: string, oldName: string, newName: string) {
    this.model.renameTask(project, oldName, newName);
    this.save();
  }

  private save() {
  }
}
