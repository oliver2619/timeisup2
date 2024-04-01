import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tiu-records-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './records-help.component.html',
  styleUrl: './records-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsHelpComponent {

}
