import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageBoxComponent } from "./elements/message-box/message-box.component";
import {ToastContainerComponent} from "./elements/toast-container/toast-container.component";

@Component({
    selector: 'tiu-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, MessageBoxComponent, ToastContainerComponent]
})
export class AppComponent {
}
