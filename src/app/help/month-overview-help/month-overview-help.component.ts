import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuComponent } from '../../elements/menu/menu.component';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';

@Component({
    selector: 'tiu-month-overview-help',
    imports: [MenuComponent, HelpButtonDirective, BackButtonDirective],
    templateUrl: './month-overview-help.component.html',
    styleUrl: './month-overview-help.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthOverviewHelpComponent {

}
