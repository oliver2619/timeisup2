import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { RecordEditRouteParams } from '../page/record-edit/record-edit.component';
import { selectAccounting } from '../selector/accounting-selectors';

export const recordGuard: CanActivateFn = (route, _) => {

  const params = route.params as RecordEditRouteParams;
  const index = Number.parseInt(params.index);
  const year = Number.parseInt(params.year);
  const month = Number.parseInt(params.month);
  const day = Number.parseInt(params.day);
  const router = inject(Router);
  return inject(Store).select(selectAccounting).pipe(
    map(acc => index >= 0 && index < (acc.months.find(m => m.year === year && m.month === month)?.days.find(d => d.day === day)?.records.length ?? 0)),
    map(found => found ? true : router.createUrlTree(['']))
  );
};
