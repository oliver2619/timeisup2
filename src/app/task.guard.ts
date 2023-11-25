import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ModelService} from "./model.service";
import {TaskRouteParams} from "./task/task.component";

export const taskGuard: CanActivateFn = (route, _) => {
  const params = route.params as TaskRouteParams;
  const modelService = inject(ModelService);
  if (!modelService.hasTask(params.project, params.task)) {
    const router = inject(Router);
    if (modelService.hasProject(params.project)) {
      return router.createUrlTree(['projects', params.project]);
    } else {
      return router.createUrlTree(['projects']);
    }
  }
  return true;
};
