import { ChangeDetectionStrategy, Component, signal, inject, Signal, computed } from '@angular/core';

import { MenuComponent } from "../../elements/menu/menu.component";
import { RouterModule } from '@angular/router';
import { HoursPipe } from '../../elements/hours.pipe';
import { Store } from '@ngrx/store';
import { selectCurrentTask, selectOverhours } from '../../selector/accounting-selectors';
import { RecordState } from '../../state/record-state';

@Component({
    selector: 'tiu-overview',
    imports: [MenuComponent, RouterModule, HoursPipe],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {

  private readonly store = inject(Store);
  private readonly currentTaskObj = this.store.selectSignal(selectCurrentTask);

  readonly currentProject = computed(() => this.currentTaskObj()?.project);
  readonly currentTask = computed(() => this.currentTaskObj()?.task);
  readonly currentlyWorking = computed(() => this.currentTaskObj() != undefined);
  readonly overhours = this.store.selectSignal(selectOverhours);
  
}
