import {SettingsJson} from "./settings-json";
import {DayOfWeek} from "./dayofweek";

export class Settings {

  get daysOfWeek(): Set<DayOfWeek> {
    return new Set<DayOfWeek>(this._daysOfWeek);
  }

  get hoursPerDay(): number{
    return this.daysOfWeek.size > 0 ? this.hoursPerWeek * this.pensum / (100 * this.daysOfWeek.size) : 0;
  }

  private constructor(public maxHoursPerDay: number, public hoursPerWeek: number, public pensum: number, private readonly _daysOfWeek: Set<DayOfWeek>) {
  }

  isDayOfWeekActive(day: DayOfWeek): boolean {
    return this._daysOfWeek.has(day);
  }

  setDayOfWeekActive(day: DayOfWeek, active: boolean) {
    if (active) {
      this._daysOfWeek.add(day);
    } else {
      this._daysOfWeek.delete(day);
    }
  }

  static load(json: SettingsJson): Settings {
    const daysOfWeek = new Set<DayOfWeek>();
    if (json.daysOfWeek != undefined) {
      json.daysOfWeek.forEach(it => daysOfWeek.add(it));
    } else {
      this.initDaysOfWeek(daysOfWeek);
    }
    return new Settings(json.maxHoursPerDay, json.hoursPerWeek, json.pensum ?? 100, daysOfWeek);
  }

  static newInstance(): Settings {
    const daysOfWeek = new Set<DayOfWeek>();
    this.initDaysOfWeek(daysOfWeek);
    return new Settings(12, 42, 100, daysOfWeek);
  }

  save(): SettingsJson {
    return {
      hoursPerWeek: this.hoursPerWeek,
      maxHoursPerDay: this.maxHoursPerDay,
      pensum: this.pensum,
      daysOfWeek: Array.from(this._daysOfWeek)
    };
  }

  private static initDaysOfWeek(daysOfWeek: Set<DayOfWeek>) {
    [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY].forEach(it => daysOfWeek.add(it));
  }
}
