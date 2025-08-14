import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MessageBoxComponent } from "./elements/message-box/message-box.component";
import {ToastContainerComponent} from "./elements/toast-container/toast-container.component";

@Component({
    selector: 'tiu-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, MessageBoxComponent, ToastContainerComponent]
})
export class AppComponent {
}
