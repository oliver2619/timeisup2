import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tiu-day-entry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-entry.component.html',
  styleUrl: './day-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayEntryComponent {

}
