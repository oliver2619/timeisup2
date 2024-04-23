import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { DayOfWeek } from '../../model/dayofweek';
import { ModelJson, modelJsonStorePrefix } from '../../model/model-json';
import { SettingsJson2 } from '../../model/settings-json';
import { SettingsSetAction } from '../action/settings-actions';
import { SettingsState } from '../state/settings-state';

const settingsJsonLocalStoreKey = `${modelJsonStorePrefix}settings`;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  loadSettings(): Observable<SettingsState> {
    const settingsJson = localStorage.getItem(settingsJsonLocalStoreKey);
    if (settingsJson != null) {
      const settings = JSON.parse(settingsJson) as SettingsJson2;
      return of({
        hoursPerWeek: settings.hoursPerWeek,
        maxHoursPerDay: settings.maxHoursPerDay,
        pensumPercentage: settings.pensumPercentage,
        workingDays: settings.workingDays
      });
    }
    const modelJson = localStorage.getItem(modelJsonStorePrefix);
    if (modelJson != null) {
      const settings = (JSON.parse(modelJson) as ModelJson).settings;
      if (settings != undefined) {
        return of({
          hoursPerWeek: settings.hoursPerWeek,
          maxHoursPerDay: settings.maxHoursPerDay,
          pensumPercentage: settings.pensum ?? 100,
          workingDays: settings.daysOfWeek ?? [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY]
        });
      }
    }
    return EMPTY;
  }

  setSettings(action: SettingsSetAction): Observable<SettingsState> {
    const json: SettingsJson2 = {
      version: 2,
      hoursPerWeek: action.hoursPerWeek,
      maxHoursPerDay: action.maxHoursPerDay,
      pensumPercentage: action.pensumPercentage,
      workingDays: action.workingDays
    };
    localStorage.setItem(settingsJsonLocalStoreKey, JSON.stringify(json));
    return of({
      hoursPerWeek: action.hoursPerWeek,
      maxHoursPerDay: action.maxHoursPerDay,
      pensumPercentage: action.pensumPercentage,
      workingDays: action.workingDays
    });
  }
}
