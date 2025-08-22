import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest, filter, map, Observable } from "rxjs";
import { ProjectRouteParams } from "../../page/project/project.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageBoxService } from '../../service/message-box.service';
import { FavoriteButtonComponent } from "../favorite-button/favorite-button.component";
import { ActiveButtonComponent } from "../active-button/active-button.component";
import { TaskState } from '../../state/task-state';
import { selectProjects } from '../../selector/project-settings-selectors';
import { ProjectSettingsService } from '../../service/project-settings.service';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

interface TasksFormValue {
  name: string;
}

@Component({
  selector: 'tiu-tasks',
  imports: [ReactiveFormsModule, FavoriteButtonComponent, ActiveButtonComponent, AsyncPipe],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {

  readonly formGroup: FormGroup;
  readonly tasks$: Observable<TaskState[]>;

  private readonly router = inject(Router);
  private readonly messageBoxService = inject(MessageBoxService);
  private readonly projectSettingsService = inject(ProjectSettingsService);
  private currentProjectName = '';

  get canAddTask(): boolean {
    return this.formGroup.valid;
  }

  private get value(): TasksFormValue {
    return this.formGroup.value as TasksFormValue;
  }

  constructor() {
    const store = inject(Store);
    const route = inject(ActivatedRoute);
    const formBuilder = inject(FormBuilder);

    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('name', formBuilder.control('', [Validators.required]));
    const selectedRoute$ = route.params as Observable<ProjectRouteParams>;
    selectedRoute$.subscribe({ next: p => this.currentProjectName = p.name });
    this.tasks$ = combineLatest([selectedRoute$, store.select(selectProjects)]).pipe(
      map(([selectedRoute, projects]) => projects.find(p => p.name === selectedRoute.name)),
      filter(it => it != undefined),
      map(it => Object.values(it!!.tasks).sort((t1, t2) => t1.name.localeCompare(t2.name)))
    );
  }

  addTask() {
    const v = this.value;
    this.projectSettingsService.addTask(this.currentProjectName, v.name).subscribe({
      next: result => {
        if (result) {
          v.name = '';
          this.formGroup.setValue(v);
        }
      }
    });
  }

  canRemoveTask(task: string): boolean {
    return this.projectSettingsService.canDeleteTask(this.currentProjectName, task);
  }

  canSetTaskFavorite(task: string): boolean {
    return this.projectSettingsService.canSetTaskFavorite(this.currentProjectName, task);
  }

  editTask(task: string) {
    this.router.navigate(['projects', this.currentProjectName, 'tasks', task]);
  }

  removeTask(task: string) {
    const projectName = this.currentProjectName;
    this.messageBoxService.question(`Do you want to remove task ${task} from project ${projectName}?`).subscribe({
      next: result => {
        if (result) {
          this.projectSettingsService.deleteTask(projectName, task).subscribe({ next: _ => { } });
        }
      }
    });
  }

  setActive(task: string, active: boolean) {
    this.projectSettingsService.setTask(this.currentProjectName, task, task, active).subscribe({ next: _ => { } });
  }

  setFavorite(task: string) {
    this.projectSettingsService.setTaskFavorite(this.currentProjectName, task).subscribe({ next: _ => { } });
  }
}
