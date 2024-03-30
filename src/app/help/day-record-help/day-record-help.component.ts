import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { BackButtonDirective } from '../../elements/back-button.directive';
import { HelpButtonDirective } from '../../elements/help-button.directive';

@Component({
  selector: 'tiu-day-record-help',
  standalone: true,
  imports: [CommonModule, MenuComponent, HelpButtonDirective, BackButtonDirective],
  templateUrl: './day-record-help.component.html',
  styleUrl: './day-record-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayRecordHelpComponent {

}
