import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tiu-settings-help',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './settings-help.component.html',
  styleUrl: './settings-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsHelpComponent {

}
