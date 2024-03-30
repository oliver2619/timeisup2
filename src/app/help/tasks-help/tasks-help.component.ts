import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'tiu-tasks-help',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './tasks-help.component.html',
  styleUrl: './tasks-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksHelpComponent {

}
