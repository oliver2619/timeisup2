import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tiu-check-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-button.component.html',
  styleUrl: './check-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckButtonComponent {

  @Input('active')
  active = false;

  @Output('change-active')
  readonly onChangeActive = new EventEmitter<boolean>();

  onClick() {
    this.onChangeActive.emit(!this.active);
  }
}
