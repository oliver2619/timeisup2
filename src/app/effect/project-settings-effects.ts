import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map } from "rxjs";
import { globalActions } from "../action/global-actions";
import { projectActions } from "../action/project-actions";
import { ProjectSettingsService } from "../service/project-settings.service";

export const loadProjectSettingsEffect = createEffect(() => {
    const projectSettingsService = inject(ProjectSettingsService);
    return inject(Actions).pipe(
        ofType(globalActions.start),
        exhaustMap(() => projectSettingsService.loadProjectSettings().pipe(map(value => projectActions.load(value))))
    );
}, { functional: true });
