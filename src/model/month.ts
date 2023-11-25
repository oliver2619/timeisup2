import {Task} from "./task";
import {Workingday} from "./workingday";

export class Month {

  private activeDay: Workingday | undefined;

  constructor(public month: number, public year: number, private readonly _days: Workingday[]) {
  }

  startTask(time: Date, task: Task) {
    this.getOrCreateActiveDay(time).start(time, task);
  }

  stop() {
    this.activeDay?.stop();
    this.activeDay = undefined;
  }

  private getOrCreateActiveDay(time: Date): Workingday {
    if(this.activeDay != undefined) {
      return this.activeDay;
    }
    const day = time.getDate();
    const found = this._days.find(it => it.day === day);
    if(found != undefined) {
      this.activeDay = found;
      return found;
    }
    const newDay = new Workingday(day, []);
    this._days.push(newDay);
    this.activeDay = newDay;
    return newDay;
  }
}
