import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dayOverviewGuard } from './day-overview.guard';

describe('dayOverviewGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dayOverviewGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
