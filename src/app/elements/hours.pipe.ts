import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from "@angular/common";

@Pipe({
  name: 'tiuHours',
  standalone: true
})
export class HoursPipe implements PipeTransform {

  private readonly decimalPipe = new DecimalPipe('en-US');

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value != 'number' && typeof value != 'string') {
      return value;
    }
    const hours = this.decimalPipe.transform(value, '1.1-1');
    return `${hours}\u00a0h`;
  }

}
