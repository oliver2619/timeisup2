
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { globalActions } from '../action/global-actions';
import { settingsActions } from '../action/settings-actions';
import { SettingsService } from '../service/settings.service';

export const loadSettingsEffect = createEffect(() => {
    const settingsService = inject(SettingsService);
    return inject(Actions).pipe(
        ofType(globalActions.start),
        exhaustMap(() => settingsService.loadSettings().pipe(map(value => settingsActions.load(value))))
    );
}, { functional: true });

export const saveSettingsEffect = createEffect(() => {
    const settingsService = inject(SettingsService);
    return inject(Actions).pipe(
        ofType(settingsActions.set),
        exhaustMap(action => settingsService.setSettings(action).pipe(map(value => settingsActions.load(value))))
    );
}, { functional: true });
