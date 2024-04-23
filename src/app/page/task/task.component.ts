import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TasksComponent } from "../../elements/tasks/tasks.component";
import { BackButtonDirective } from '../../elements/back-button.directive';
import { Store } from '@ngrx/store';
import { filter, map, Observable, zip } from 'rxjs';
import { selectTasksByProject } from '../../selector/project-settings-selectors';
import { TaskState } from '../../state/task-state';
import { ProjectSettingsService } from '../../service/project-settings.service';

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
  imports: [CommonModule, MenuComponent, ReactiveFormsModule, RouterLink, TasksComponent, BackButtonDirective],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {

  readonly formGroup: FormGroup;

  projectName$: Observable<string>;

  private currentTask: TaskState | undefined;
  private currentProject: string = '';

  get canReset(): boolean {
    return this.formGroup.dirty;
  }

  get canSave(): boolean {
    return this.formGroup.valid && this.formGroup.dirty;
  }

  private get value(): TaskFormValue {
    return this.formGroup.value as TaskFormValue;
  }

  constructor(private readonly router: Router, private readonly store: Store, private readonly projectSettingsService: ProjectSettingsService, route: ActivatedRoute, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', Validators.required));
    this.formGroup.addControl('active', formBuilder.control(true));
    const selectedTask$ = zip(route.params as Observable<TaskRouteParams>, store.select(selectTasksByProject)).pipe(
      map(([routeParams, tasksByProject]) => {
        const ts = tasksByProject[routeParams.project];
        return ts?.find(it => it.name === routeParams.task);
      }),
      filter(it => it != undefined)
    ) as Observable<TaskState>;
    selectedTask$.subscribe({
      next: task => {
        this.currentTask = task;
        this.onTaskChange(task);
      }
    });
    this.projectName$ = route.params.pipe(map(it => (it as TaskRouteParams).project));
    route.params.subscribe({ next: it => this.currentProject = (it as TaskRouteParams).project });
  }

  reset() {
    if (this.currentTask != undefined) {
      const v = this.value;
      v.name = this.currentTask.name;
      v.active = this.currentTask.active;
      this.formGroup.setValue(v);
      this.formGroup.markAsPristine();
    }
  }

  save() {
    if (this.currentTask != undefined) {
      const v = this.value;
      const taskName = this.currentTask.name;
      this.projectSettingsService.setTask(this.currentProject, taskName, v.name, v.active).subscribe({
        next: result => {
          if (result) {
            if (v.name !== taskName) {
              this.router.navigate(['projects', this.currentProject, 'tasks', v.name]);
            } else {
              this.formGroup.markAsPristine();
            }
          }
        }
      });
    }
  }

  private onTaskChange(task: TaskState) {
    const v = this.value;
    v.name = task.name;
    v.active = task.active;
    this.formGroup.setValue(v);
    this.formGroup.markAsPristine();
  }
}
