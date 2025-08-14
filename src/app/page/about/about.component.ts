import {ChangeDetectionStrategy, Component} from '@angular/core';

import {MenuComponent} from "../../elements/menu/menu.component";
import {version} from "../../../../package.json";

@Component({
    selector: 'tiu-about',
    imports: [MenuComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {

  get version(): string {
    return version;
  }
}
