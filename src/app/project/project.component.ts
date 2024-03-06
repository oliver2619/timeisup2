import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {TasksComponent} from "../tasks/tasks.component";
import {ModelService} from "../model.service";

export interface ProjectRouteParams {
  name: string;
}

interface ProjectFormValue {
  name: string;
  active: boolean;
}

@Component({
  selector: 'tiu-project',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, RouterLink, TasksComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProjectComponent implements OnDestroy {

  readonly formGroup: FormGroup;

  project: string = '';

  private readonly subscription: Subscription;

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    const v = this.value;
    return this.formGroup.dirty && this.formGroup.valid && (!this.modelService.hasProject(v.name) || v.name === this.project);
  }

  private get value(): ProjectFormValue {
    return this.formGroup.value as ProjectFormValue;
  }

  constructor(private readonly modelService: ModelService, private readonly router: Router, route: ActivatedRoute, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', Validators.required));
    this.formGroup.addControl('active', formBuilder.control(true));
    this.subscription = route.params.subscribe({next: value => this.onRouteChange(value as ProjectRouteParams)});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  reset() {
    const v = this.value;
    v.name = this.project;
    v.active = this.modelService.isProjectActive(this.project);
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }

  save() {
    const v = this.value;
    this.modelService.setProjectActive(this.project, v.active);
    this.formGroup.markAsPristine();
    if(v.name !== this.project) {
      this.modelService.renameProject(this.project, v.name);
      this.router.navigate(['projects', v.name]);
    }
  }

  private onRouteChange(params: ProjectRouteParams) {
    this.project = params.name;
    const v = this.value;
    v.name = params.name;
    v.active = this.modelService.isProjectActive(params.name);
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }
}
