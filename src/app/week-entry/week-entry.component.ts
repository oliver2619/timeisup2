import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tiu-week-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-entry.component.html',
  styleUrl: './week-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekEntryComponent {

}
