export class Settings {

  private constructor(public maxHoursPerDay: number) {
  }

  static newInstance(): Settings {
    return new Settings(12);
  }
}
