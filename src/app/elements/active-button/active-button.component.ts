import {ChangeDetectionStrategy, Component, output, input} from '@angular/core';
import { NgClass} from '@angular/common';

@Component({
    selector: 'tiu-active-button',
    imports: [NgClass],
    templateUrl: './active-button.component.html',
    styleUrl: './active-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveButtonComponent {

  readonly isActive = input(true, { alias: "active" });

  readonly onChangeActive = output<boolean>({ alias: 'change-active' });

  onClick() {
    this.onChangeActive.emit(!this.isActive());
  }
}
