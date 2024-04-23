import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from "@angular/common";

@Pipe({
  name: 'tiuHours',
  standalone: true
})
export class HoursPipe implements PipeTransform {

  private readonly decimalPipe = new DecimalPipe('en-US');

  transform(value: unknown, ..._: unknown[]): unknown {
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
    if(hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours - days * 24;
      return `${this.decimalPipe.transform(days, '1.0-0')}d\u00a0${this.decimalPipe.transform(remainingHours, '1.1-1')}h`;
    }else {
      return `${this.decimalPipe.transform(hours, '1.1-1')}h`
    }
  }
}
