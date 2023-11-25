import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'tiu-day-recording',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './day-recording.component.html',
  styleUrl: './day-recording.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayRecordingComponent {

}
