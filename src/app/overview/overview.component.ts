import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from "../menu/menu.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tiu-overview',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {

}
