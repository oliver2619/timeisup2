import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DayRouteParams } from './day-route-params';
import { ModelService } from './model.service';

export const monthOverviewEntryGuard: CanActivateFn = (route, _) => {
  const date: DayRouteParams = route.params as DayRouteParams;
  const modelService = inject(ModelService);
  if(modelService.hasRecordings(Number.parseInt(date.year), Number.parseInt(date.month), Number.parseInt(date.day))) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(['month']);
};
