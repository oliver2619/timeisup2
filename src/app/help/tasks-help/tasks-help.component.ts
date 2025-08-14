import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { MenuComponent } from '../../elements/menu/menu.component';

@Component({
    selector: 'tiu-tasks-help',
    imports: [MenuComponent, HelpButtonDirective, BackButtonDirective],
    templateUrl: './tasks-help.component.html',
    styleUrl: './tasks-help.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksHelpComponent {

}
