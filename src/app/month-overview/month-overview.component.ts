import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'tiu-month-overview',
  standalone: true,
    imports: [CommonModule, MenuComponent],
  templateUrl: './month-overview.component.html',
  styleUrl: './month-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthOverviewComponent {

}
