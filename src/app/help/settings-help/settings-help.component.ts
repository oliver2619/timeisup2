import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../elements/menu/menu.component';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { BackButtonDirective } from '../../elements/back-button.directive';

@Component({
  selector: 'tiu-settings-help',
  standalone: true,
  imports: [CommonModule, MenuComponent, HelpButtonDirective, BackButtonDirective],
  templateUrl: './settings-help.component.html',
  styleUrl: './settings-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsHelpComponent {

}
