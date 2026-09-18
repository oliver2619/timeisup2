import { Component, inject, OnDestroy, Signal, viewChild } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { MessageBoxComponent } from "./elements/message-box/message-box.component";
import { ToastContainerComponent } from "./elements/toast-container/toast-container.component";
import { MessageBoxService } from './service/message-box.service';
import { MessageBox } from './elements/message-box/message-box';

@Component({
    selector: 'tiu-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, MessageBoxComponent, ToastContainerComponent]
})
export class AppComponent implements OnDestroy {

    private readonly messageBox = viewChild.required(MessageBoxComponent) as Signal<MessageBox>;
    private readonly messageBoxService = inject(MessageBoxService);

    constructor() {
        this.messageBoxService.setHandler({
            information: message => this.messageBox().showInformation(message),
            question: message => this.messageBox().showQuestionOkCancel(message),
            questionYesNoCancel: message => this.messageBox().showQuestionYesNoCancel(message)
        });
    }

    ngOnDestroy(): void {
        this.messageBoxService.setHandler(undefined);
    }
}
