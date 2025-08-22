import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from "@angular/common";

@Pipe({
  name: 'tiuHours',
})
export class HoursPipe implements PipeTransform {

  transform(value: unknown): unknown {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return value;
    }
    const hours = typeof value === 'string' ? Number.parseFloat(value) : value;
    if (hours < 0) {
      return `-${this.transformPositiveHours(-hours)}`;
    } else {
      return this.transformPositiveHours(hours);
    }
  }

  private transformPositiveHours(hours: number): string {
    const locale = document.documentElement.lang;
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours - days * 24;
      return `${formatNumber(days, locale, '1.0-0')}d\u00a0${formatNumber(remainingHours, locale, '1.2-2')}h`;
    } else {
      return `${formatNumber(hours, locale, '1.2-2')}h`;
    }
  }
}
