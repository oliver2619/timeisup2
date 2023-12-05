import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuComponent } from "../menu/menu.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DayRouteParams } from '../day-route-params';
import { DayEntriesComponent } from "../day-entries/day-entries.component";

@Component({
    selector: 'tiu-month-edit-entry',
    standalone: true,
    templateUrl: './month-edit-entry.component.html',
    styleUrl: './month-edit-entry.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, MenuComponent, DayEntriesComponent, DatePipe]
})
export class MonthEditEntryComponent {

    year = 0;
    month = 0;
    day = 0;
    date = new Date();

    constructor(activatedRoute: ActivatedRoute) {
        activatedRoute.params.subscribe({
            next: paramsString => {
                const date: DayRouteParams = paramsString as DayRouteParams;
                this.year = Number.parseInt(date.year);
                this.month = Number.parseInt(date.month);
                this.day = Number.parseInt(date.day);
                this.date = new Date();
                this.date.setFullYear(this.year);
                this.date.setMonth(this.month);
                this.date.setDate(this.day);
                this.date.setHours(0);
                this.date.setMinutes(0);
                this.date.setSeconds(0);
                this.date.setMilliseconds(0);
            }
        });
    }
}
