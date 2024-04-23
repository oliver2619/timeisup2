import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { DayRouteParams } from '../day-route-params';
import { selectAccounting } from '../selector/accounting-selectors';

export const dayOverviewGuard: CanActivateFn = (route, _) => {

  const date: DayRouteParams = route.params as DayRouteParams;
  const year = Number.parseInt(date.year);
  const month = Number.parseInt(date.month);
  const day = Number.parseInt(date.day);
  const router = inject(Router);
  return inject(Store).select(selectAccounting).pipe(
    map(acc => {
      if (acc.months.find(m => m.year === year && m.month === month)?.days.find(d => d.day === day) == undefined) {
        return router.createUrlTree(['month']);
      } else {
        return true;
      }
    })
  );
};
