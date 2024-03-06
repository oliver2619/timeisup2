import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'tiu-active-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-button.component.html',
  styleUrl: './active-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveButtonComponent {

  @Input('active')
  isActive = true;

  @Output('change-active')
  readonly onChangeActive = new EventEmitter<boolean>();

  onClick() {
    this.onChangeActive.emit(!this.isActive);
  }
}
