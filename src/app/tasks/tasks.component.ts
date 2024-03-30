import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ModelService} from "../model.service";
import {ProjectRouteParams} from "../project/project.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageBoxService} from '../message-box.service';
import {FavoriteButtonComponent} from "../elements/favorite-button/favorite-button.component";
import {ActiveButtonComponent} from "../elements/active-button/active-button.component";
import { ButtonErrorDirective } from '../elements/button-error.directive';

interface TasksFormValue {
  name: string;
}

@Component({
  selector: 'tiu-tasks',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, FavoriteButtonComponent, ActiveButtonComponent, ButtonErrorDirective],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TasksComponent implements OnDestroy {

  readonly formGroup: FormGroup;
  tasks: string[] = [];

  private readonly subscription: Subscription;
  private project: string = '';

  get canAddTask(): boolean {
    const v = this.value;
    return this.formGroup.valid && !this.modelService.hasTask(this.project, v.name);
  }

  private get value(): TasksFormValue {
    return this.formGroup.value as TasksFormValue;
  }

  constructor(private readonly modelService: ModelService, private readonly router: Router, private readonly messageBoxService: MessageBoxService, route: ActivatedRoute, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', [Validators.required]));
    this.subscription = route.params.subscribe({next: value => this.onRouteChange(value as ProjectRouteParams)});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addTask() {
    const v = this.value;
    this.modelService.addTask(this.project, v.name);
    this.updateTasks();
    v.name = '';
    this.formGroup.setValue(v);
  }

  canRemoveTask(task: string): boolean {
    return !this.modelService.isTaskInUse(this.project, task);
  }

  canUseAsFavorite(task: string): boolean {
    return this.modelService.canUseTaskAsFavorite(this.project, task);
  }

  editTask(task: string) {
    this.router.navigate(['projects', 'settings', this.project, 'tasks', 'settings', task]);
  }

  isActive(task: string): boolean {
    return this.modelService.isTaskActive(this.project, task);
  }

  isFavorite(task: string): boolean {
    return this.modelService.getFavoriteTask(this.project) === task;
  }

  removeTask(task: string) {
    this.messageBoxService.question(`Do you want to remove task ${task} from project ${this.project}?`).subscribe({
      next: result => {
        if (result) {
          this.modelService.removeTask(this.project, task);
          this.updateTasks();
        }
      }
    });
  }

  setActive(task: string, active: boolean) {
    this.modelService.setTaskActive(this.project, task, active);
  }

  setFavorite(task: string) {
    this.modelService.setFavoriteTask(this.project, task);
  }

  private onRouteChange(params: ProjectRouteParams) {
    this.project = params.name;
    this.updateTasks();
  }

  private updateTasks() {
    this.tasks = this.modelService.getTasksForProject(this.project);
    this.tasks.sort((t1, t2) => t1.localeCompare(t2));
  }
}
