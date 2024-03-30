import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'tiu-projects-help',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './projects-help.component.html',
  styleUrl: './projects-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsHelpComponent {

}
