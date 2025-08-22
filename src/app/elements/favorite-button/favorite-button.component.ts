import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { ButtonErrorDirective } from '../button-error.directive';
import { NgClass } from '@angular/common';

@Component({
  selector: 'tiu-favorite-button',
  imports: [NgClass, ButtonErrorDirective],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteButtonComponent {

  readonly isFavorite = input(false, { alias: "favorite" });

  readonly enabled = input(true);

  readonly buttonError = input('', { alias: "error" });

  readonly onChangeFavorite = output<void>({ alias: 'change-favorite' });

  onClick() {
    this.onChangeFavorite.emit(undefined);
  }
}
