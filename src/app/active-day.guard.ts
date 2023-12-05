import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DayEntryRouteParams } from './day-entry/day-entry.component';
import { ModelService } from './model.service';

export const activeDayGuard: CanActivateFn = (route, _) => {
  const modelService = inject(ModelService);
  const params = route.params as DayEntryRouteParams;
  const index = Number.parseInt(params.index);
  const year = Number.parseInt(params.year);
  const month = Number.parseInt(params.month);
  const day = Number.parseInt(params.day);
  if(index >= 0 && index < modelService.getDayRecords(year, month, day).length) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(['day']);
};
