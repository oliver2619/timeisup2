import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonErrorDirective } from '../button-error.directive';

@Component({
  selector: 'tiu-favorite-button',
  standalone: true,
  imports: [CommonModule, ButtonErrorDirective],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteButtonComponent {

  @Input('favorite')
  isFavorite = false;

  @Input('enabled')
  enabled = true;

  @Input('error')
  buttonError = '';

  @Output('change-favorite')
  readonly onChangeFavorite = new EventEmitter<void>();

  onClick() {
    this.onChangeFavorite.emit();
  }
}
