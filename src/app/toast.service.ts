import {EventEmitter, Injectable} from '@angular/core';

export interface Toast {
  readonly message: string;
  readonly type: 'info' | 'error';
  readonly until: Date;
  readonly from: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  readonly onToast = new EventEmitter<Toast>();

  info(message: string) {
    const from = new Date();
    const until = new Date();
    until.setTime(from.getTime() + 15000);
    this.onToast.emit({message, type: 'info', from, until});
  }

  error(message: string) {
    const from = new Date();
    const until = new Date();
    until.setTime(from.getTime() + 30000);
    this.onToast.emit({message, type: 'error', from, until});
  }
}
