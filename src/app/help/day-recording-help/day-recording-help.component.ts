import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tiu-day-recording-help',
  standalone: true,
  imports: [CommonModule, MenuComponent, RouterModule],
  templateUrl: './day-recording-help.component.html',
  styleUrl: './day-recording-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayRecordingHelpComponent {

}
