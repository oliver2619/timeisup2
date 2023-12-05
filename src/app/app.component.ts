import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageBoxComponent } from "./message-box/message-box.component";

@Component({
    selector: 'tiu-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, MessageBoxComponent]
})
export class AppComponent {
}
