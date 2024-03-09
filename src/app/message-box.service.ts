import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MessageBoxHandler {

  information(message: string): void;

  question(message: string): Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  private handler: MessageBoxHandler | undefined;

  constructor() { }

  setHandler(handler: MessageBoxHandler | undefined) {
    this.handler = handler;
  }

  information(message: string) {
    if (this.handler == undefined) {
      throw new Error('No message box handler registered');
    }
    this.handler.information(message);
  }

  question(message: string): Observable<boolean> {
    if (this.handler == undefined) {
      throw new Error('No message box handler registered');
    }
    return this.handler.question(message);
  }
}
