import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tiu-favorite-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteButtonComponent {

  @Input('favorite')
  isFavorite = false;

  @Input('enabled')
  enabled = true;

  @Output('change-favorite')
  readonly onChangeFavorite = new EventEmitter<void>();

  onClick() {
    this.onChangeFavorite.emit();
  }
}
