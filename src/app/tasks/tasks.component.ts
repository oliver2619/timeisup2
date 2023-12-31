import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ModelService} from "../model.service";
import {ProjectRouteParams} from "../project/project.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

interface TasksFormValue {
  name: string;
}

@Component({
  selector: 'tiu-tasks',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(private readonly modelService: ModelService, private readonly router: Router, route: ActivatedRoute, formBuilder: FormBuilder) {
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

  editTask(task: string) {
    this.router.navigate(['projects', this.project, 'tasks', task]);
  }

  removeTask(task: string) {
    this.modelService.removeTask(this.project, task);
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
