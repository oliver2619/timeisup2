import { ChangeDetectionStrategy, Component, OnInit, signal, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, concat, map, Observable, of } from 'rxjs';
import { selectActiveTasksByProject, selectProjectSettings, TasksByProject } from '../../selector/project-settings-selectors';
import { Store } from '@ngrx/store';
import { TaskState } from '../../state/task-state';
import { ProjectSettingsState } from '../../state/project-settings-state';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'tiu-select-task',
  imports: [NgClass, AsyncPipe],
  templateUrl: './select-task.component.html',
  styleUrl: './select-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTaskComponent implements OnInit {

  readonly projectControl = input.required<FormControl<string>>({ alias: "project-control" });
  readonly taskControl = input.required<FormControl<string>>({ alias: "task-control" });

  readonly value = signal('');
  readonly isEnabled = signal(false);

  tasks$: Observable<ReadonlyArray<TaskState>> = of([]);

  private readonly tasksByProject$: Observable<TasksByProject>;
  private readonly projectSettings$: Observable<ProjectSettingsState>;

  constructor() {
    const store = inject(Store);

    this.tasksByProject$ = store.select(selectActiveTasksByProject);
    this.projectSettings$ = store.select(selectProjectSettings);
  }

  ngOnInit() {
    const projectControl = this.projectControl();
    const taskControl = this.taskControl();
    const project$ = concat(of(projectControl.value), projectControl.valueChanges);
    this.tasks$ = combineLatest([this.tasksByProject$, project$]).pipe(
      map(([tasksByProject, project]) => tasksByProject[project])
    );
    combineLatest([this.projectSettings$, project$]).pipe(
      map(([settings, project]) => settings.projects[project].favoriteTask)
    ).subscribe({
      next: f => {
        if (f != undefined) {
          const taskControlValue = this.taskControl().value;
          if (taskControlValue === '' || taskControlValue == null) {
            taskControl.setValue(f);
          }
        }
      }
    });
    this.tasks$.subscribe({ next: p => this.isEnabled.set(p.length > 1) });
    concat(of(taskControl.value), taskControl.valueChanges).subscribe({
      next: v => {
        this.value.set(v);
      }
    });
  }

  onChange(value: string) {
    this.taskControl().setValue(value);
  }
}
