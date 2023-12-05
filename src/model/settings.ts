import { SettingsJson } from "./settings-json";

export class Settings {

  private constructor(public maxHoursPerDay: number, public hoursPerWeek: number) {
  }

  static load(json: SettingsJson): Settings {
    return new Settings(json.maxHoursPerDay, json.hoursPerWeek);
  }

  static newInstance(): Settings {
    return new Settings(12, 42);
  }

  save(): SettingsJson {
    return {
      hoursPerWeek: this.hoursPerWeek,
      maxHoursPerDay: this.maxHoursPerDay
    };
  }
}
