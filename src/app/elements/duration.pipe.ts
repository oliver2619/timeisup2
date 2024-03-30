import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiuDuration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  private readonly datePipe = new DatePipe('en-US');

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'number') {
      return value;
    }
    const date = new Date();
    date.setTime(value * 3600_000);
    return this.datePipe.transform(date, 'HH:mm', 'GMT');
  }
}
