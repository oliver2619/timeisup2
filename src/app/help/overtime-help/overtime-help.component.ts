import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuComponent } from "../../elements/menu/menu.component";
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';

@Component({
  selector: 'tiu-overtime-help',
  imports: [MenuComponent, HelpButtonDirective, BackButtonDirective],
  templateUrl: './overtime-help.component.html',
  styleUrl: './overtime-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OvertimeHelpComponent {

}
