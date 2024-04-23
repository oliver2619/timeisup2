import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiuTime',
  standalone: true
})
export class TimePipe implements PipeTransform {

  private readonly datePipe = new DatePipe('en-US');

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      return this.datePipe.transform(value, 'HH:mm');
    } else {
      return value;
    }
  }

}
