import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { HelpButtonDirective } from '../../elements/help-button.directive';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'tiu-day-edit-help',
  standalone: true,
  imports: [CommonModule, MenuComponent, HelpButtonDirective, BackButtonDirective],
  templateUrl: './day-edit-help.component.html',
  styleUrl: './day-edit-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayEditHelpComponent {

}
