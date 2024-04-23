import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from "../../elements/menu/menu.component";
import {version} from "../../../../package.json";

@Component({
  selector: 'tiu-about',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {

  get version(): string {
    return version;
  }
}
