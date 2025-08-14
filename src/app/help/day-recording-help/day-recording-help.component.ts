import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuComponent } from '../../elements/menu/menu.component';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { RecordsHelpComponent } from '../records-help/records-help.component';

@Component({
    selector: 'tiu-day-recording-help',
    imports: [MenuComponent, HelpButtonDirective, BackButtonDirective, RecordsHelpComponent],
    templateUrl: './day-recording-help.component.html',
    styleUrl: './day-recording-help.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayRecordingHelpComponent {

}
