import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { combineLatest, concat, map, merge, Observable, of } from 'rxjs';
import { selectActiveTasksByProject, selectProjectSettings, TasksByProject } from '../../selector/project-settings-selectors';
import { Store } from '@ngrx/store';
import { TaskState } from '../../state/task-state';
import { ProjectSettingsState } from '../../state/project-settings-state';

@Component({
  selector: 'tiu-select-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-task.component.html',
  styleUrl: './select-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTaskComponent implements OnInit {

  @Input('project-control')
  projectControl: FormControl<string> | undefined;

  @Input('task-control')
  taskControl: FormControl<string> | undefined;

  tasks$: Observable<ReadonlyArray<TaskState>> = of([]);
  readonly isEnabled: WritableSignal<boolean> = signal(false);

  private readonly tasksByProject$: Observable<TasksByProject>;
  private readonly projectSettings$: Observable<ProjectSettingsState>;
  private favorite: string | undefined;

  get value(): string {
    return this.taskControl == undefined ? '' : this.taskControl.value;
  }

  constructor(store: Store) {
    this.tasksByProject$ = store.select(selectActiveTasksByProject);
    this.projectSettings$ = store.select(selectProjectSettings);
  }

  ngOnInit() {
    if (this.projectControl == undefined || this.taskControl == undefined) {
      throw new RangeError('project-control and task-control must be set');
    }
    const project$ = concat(of(this.projectControl.value), this.projectControl.valueChanges);
    this.tasks$ = combineLatest([this.tasksByProject$, project$]).pipe(
      map(([tasksByProject, project]) => tasksByProject[project])
    );
    combineLatest([this.projectSettings$, project$]).pipe(
      map(([settings, project]) => settings.projects[project].favoriteTask)
    ).subscribe({
      next: f => {
        if (f !== undefined) {
          this.favorite = f;
          this.taskControl!!.setValue(f);
        }
      }
    });
    this.tasks$.subscribe({ next: p => this.isEnabled.set(p.length > 1) });
    if (this.favorite != undefined) {
      this.taskControl.setValue(this.favorite);
    }
  }

  onChange(value: string) {
    this.taskControl!!.setValue(value);
  }
}
