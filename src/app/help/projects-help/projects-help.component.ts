import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuComponent } from '../../elements/menu/menu.component';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { HelpButtonDirective } from '../../elements/help-button.directive';

@Component({
    selector: 'tiu-projects-help',
    imports: [MenuComponent, BackButtonDirective, HelpButtonDirective],
    templateUrl: './projects-help.component.html',
    styleUrl: './projects-help.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsHelpComponent {

}
