import { DatePipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiuDuration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  private readonly datePipe = new DatePipe('en-US');
  private readonly decimalPipe = new DecimalPipe('en-US');

  transform(value: unknown, ..._: unknown[]): unknown {
    if (typeof value !== 'number') {
      return value;
    }
    return value < 0 ? `-${this.transformPositiveTime(-value)}` : this.transformPositiveTime(value);
  }

  private transformPositiveTime(hours: number): string | null {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours - days * 24;
      return `${this.decimalPipe.transform(days, '1.0-0')}d\u00a0${this.decimalPipe.transform(remainingHours, '1.0-0')}h`;
    }
    const date = new Date(hours * 3600_000);
    return this.datePipe.transform(date, 'HH:mm', 'GMT');
  }
}
