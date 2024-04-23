import { ApplicationConfig, APP_INITIALIZER, ErrorHandler, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { ToastErrorHandlerService } from "./service/toast-error-handler.service";
import { provideState, provideStore, Store } from '@ngrx/store';
import { settingsReducer } from './reducer/settings-reducer';
import { globalActions } from './action/global-actions';
import { provideEffects } from '@ngrx/effects';
import * as settingsEffects from './effect/settings-effects';
import * as projectSettingsEffects from './effect/project-settings-effects';
import { projectSettingsReducer } from './reducer/project-settings-reducer';
import { accountingReducer } from './reducer/accounting-reducer';

function initApp(store: Store) {
    store.dispatch(globalActions.start());
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        {
            provide: ErrorHandler,
            useClass: ToastErrorHandlerService
        },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        provideStore(),
        provideState({ name: 'accounting', reducer: accountingReducer }),
        provideState({ name: 'settings', reducer: settingsReducer }),
        provideState({ name: 'projectSettings', reducer: projectSettingsReducer }),
        provideEffects(settingsEffects),
        provideEffects(projectSettingsEffects),
        {
            provide: APP_INITIALIZER,
            useFactory: (store: Store) => () => initApp(store),
            multi: true,
            deps: [Store]
        },
    ]
};
