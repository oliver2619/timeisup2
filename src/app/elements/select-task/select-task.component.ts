import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { combineLatest, concat, map, Observable, of } from 'rxjs';
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

  readonly value = signal('');
  readonly isEnabled: WritableSignal<boolean> = signal(false);

  tasks$: Observable<ReadonlyArray<TaskState>> = of([]);

  private readonly tasksByProject$: Observable<TasksByProject>;
  private readonly projectSettings$: Observable<ProjectSettingsState>;

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
        if (f != undefined) {
          if (this.taskControl!!.value === '' || this.taskControl!!.value == null) {
            this.taskControl!!.setValue(f);
          }
        }
      }
    });
    this.tasks$.subscribe({ next: p => this.isEnabled.set(p.length > 1) });
    concat(of(this.taskControl.value), this.taskControl.valueChanges).subscribe({
      next: v => {
        this.value.set(v);
      }
    });
  }

  onChange(value: string) {
    this.taskControl!!.setValue(value);
  }
}
