import { formatDate, formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiuDuration',
})
export class DurationPipe implements PipeTransform {

  transform(value: unknown): unknown {
    if (typeof value !== 'number') {
      return value;
    }
    return value < 0 ? `-${this.transformPositiveTime(-value)}` : this.transformPositiveTime(value);
  }

  private transformPositiveTime(hours: number): string {
    const locale = document.documentElement.lang;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours - days * 24;
      const remainingDate = new Date(remainingHours * 3600_000);
      return `${formatNumber(days, locale, '1.0-0')}d\u00a0${formatDate(remainingDate, 'HH:mm', locale, 'GMT')}`;
    }
    const date = new Date(hours * 3600_000);
    return formatDate(date, 'HH:mm', locale, 'GMT');
  }
}
