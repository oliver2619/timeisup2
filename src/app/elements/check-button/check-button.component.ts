import { NgClass } from '@angular/common';
import {ChangeDetectionStrategy, Component, output, input} from '@angular/core';

@Component({
    selector: 'tiu-check-button',
    imports: [NgClass],
    templateUrl: './check-button.component.html',
    styleUrl: './check-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckButtonComponent {

  readonly active = input(false);

  readonly changeActive = output<boolean>({ alias: 'change-active' });

  onClick() {
    this.changeActive.emit(!this.active());
  }
}
