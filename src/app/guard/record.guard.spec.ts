import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { recordGuard } from './record.guard';

describe('recordGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => recordGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
