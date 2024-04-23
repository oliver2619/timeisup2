import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "../../elements/menu/menu.component";
import { RouterModule } from '@angular/router';
import { HoursPipe } from '../../elements/hours.pipe';
import { Store } from '@ngrx/store';
import { selectCurrentTask, selectOverhours } from '../../selector/accounting-selectors';

@Component({
  selector: 'tiu-overview',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule, HoursPipe],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {

  readonly currentProject = signal('');
  readonly currentTask = signal('');
  readonly currentlyWorking = signal(false);
  readonly overhours = signal(0);

  constructor(store: Store) {
    store.select(selectCurrentTask).subscribe({
      next: task => {
        this.currentlyWorking.set(task != undefined);
        this.currentTask.set(task == undefined ? '' : task.task);
        this.currentProject.set(task == undefined ? '' : task.project);
      }
    });
    store.select(selectOverhours).subscribe({
      next: o => this.overhours.set(o)
    });
  }
}
