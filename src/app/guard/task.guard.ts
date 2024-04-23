import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { TaskRouteParams } from "../page/task/task.component";
import { Store } from '@ngrx/store';
import { selectProjects } from '../selector/project-settings-selectors';
import { map } from 'rxjs';

export const taskGuard: CanActivateFn = (route, _) => {
  const params = route.params as TaskRouteParams;
  const projectName = params.project;
  const taskName = params.task;
  const router = inject(Router);
  return inject(Store).select(selectProjects).pipe(
    map(projects => {
      const project = projects.find(p => p.name === projectName);
      if (project == undefined) {
        return router.createUrlTree(['projects']);
      }
      if (project.tasks[taskName] == undefined) {
        return router.createUrlTree(['projects', projectName]);
      }
      return true;
    })
  );
};
