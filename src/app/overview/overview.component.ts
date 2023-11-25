import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'tiu-overview',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {

}
