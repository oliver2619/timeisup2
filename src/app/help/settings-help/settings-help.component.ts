import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuComponent } from '../../elements/menu/menu.component';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';

@Component({
    selector: 'tiu-settings-help',
    imports: [MenuComponent, HelpButtonDirective, BackButtonDirective],
    templateUrl: './settings-help.component.html',
    styleUrl: './settings-help.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsHelpComponent {

}
