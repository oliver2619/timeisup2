import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tiu-month-overview-help',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule],
  templateUrl: './month-overview-help.component.html',
  styleUrl: './month-overview-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthOverviewHelpComponent {

}
