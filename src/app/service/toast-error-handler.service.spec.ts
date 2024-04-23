import { TestBed } from '@angular/core/testing';

import { ToastErrorHandlerService } from './toast-error-handler.service';

describe('ToastErrorHandlerService', () => {
  let service: ToastErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
