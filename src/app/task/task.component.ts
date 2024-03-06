import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TasksComponent} from "../tasks/tasks.component";
import {Subscription} from "rxjs";
import {ModelService} from "../model.service";

export interface TaskRouteParams {
  project: string;
  task: string;
}

interface TaskFormValue {
  name: string;
  active: boolean;
}

@Component({
  selector: 'tiu-task',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, RouterLink, TasksComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnDestroy {

  readonly formGroup: FormGroup;

  project: string = '';
  task: string = '';

  private readonly subscription: Subscription;

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    const v = this.value;
    return this.formGroup.valid && this.formGroup.dirty && (!this.modelService.hasTask(this.project, v.name) || this.task == v.name);
  }

  private get value(): TaskFormValue {
    return this.formGroup.value as TaskFormValue;
  }

  constructor(private readonly modelService: ModelService, private readonly router: Router, route: ActivatedRoute, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', Validators.required));
    this.formGroup.addControl('active', formBuilder.control(true));
    this.subscription = route.params.subscribe({next: value => this.onRouteChange(value as TaskRouteParams)});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  reset() {
    const v = this.value;
    v.name = this.task;
    v.active = this.modelService.isTaskActive(this.project, this.task);
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    const v = this.value;
    this.modelService.setTaskActive(this.project, this.task, v.active);
    this.formGroup.markAsPristine();
    if(this.task !== v.name) {
      this.modelService.renameTask(this.project, this.task, v.name);
      this.router.navigate(['projects', this.project, 'tasks', v.name]);
    }
  }

  private onRouteChange(params: TaskRouteParams) {
    this.project = params.project;
    this.task = params.task;
    const v = this.value;
    v.name = params.task;
    v.active = this.modelService.isTaskActive(params.project, params.task);
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }
}
