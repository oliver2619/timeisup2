import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiuTime',
})
export class TimePipe implements PipeTransform {

  transform(value: unknown): unknown {
    if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
      return formatDate(value, 'HH:mm', document.documentElement.lang);
    } else {
      return value;
    }
  }

}
