import { CanActivateFn, Router } from '@angular/router';
import { ProjectRouteParams } from "../page/project/project.component";
import { inject } from "@angular/core";
import { Store } from '@ngrx/store';
import { selectProjects } from '../selector/project-settings-selectors';
import { map } from 'rxjs';

export const projectGuard: CanActivateFn = (route, _) => {

  const projectName = (route.params as ProjectRouteParams).name;
  const router = inject(Router);
  return inject(Store).select(selectProjects).pipe(
    map(projects => {
      if (projects.findIndex(p => p.name === projectName) < 0) {
        return router.createUrlTree(['projects']);
      }
      return true;
    })
  );
};
