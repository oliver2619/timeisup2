import {CanActivateFn, Router} from '@angular/router';
import {ProjectRouteParams} from "./project/project.component";
import {inject} from "@angular/core";
import {ModelService} from "./model.service";

export const projectGuard: CanActivateFn = (route, _) => {
  const params = route.params as ProjectRouteParams;
  const modelService = inject(ModelService);
  if (!modelService.hasProject(params.name)) {
    const router = inject(Router);
    return router.createUrlTree(['projects']);
  }
  return true;
};
