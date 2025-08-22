import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: 'root'
})
export class ToastErrorHandlerService implements ErrorHandler {

  private readonly toastService = inject(ToastService);

  handleError(error: any): void {
    if (error instanceof Error) {
      this.toastService.error(error.message);
    } else {
      this.toastService.error(String(error));
    }
    console.error(error);
  }
}
