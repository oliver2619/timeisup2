import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccountingState } from "../state/accounting-state";
import { DateState } from "../state/date-state";
import { DayState } from "../state/day-state";
import { RecordState } from "../state/record-state";

export const selectAccounting = createSelector(
    createFeatureSelector<AccountingState>('accounting'),
    (state) => state
);

export const selectCurrentDate = createSelector(
    selectAccounting,
    (state): DateState | undefined => state.activeDay
);

export const selectCurrentDay = createSelector(
    selectAccounting,
    selectCurrentDate,
    (state, currentDate): DayState | undefined => {
        if (currentDate != undefined) {
            return state.months.find(m => m.year === currentDate.year && m.month === currentDate.month)?.days.find(d => d.day === currentDate.day);
        } else {
            return undefined;
        }
    }
);

export const selectCurrentTask = createSelector(
    selectCurrentDay,
    (currendDay): RecordState | undefined => {
        if (currendDay != undefined) {
            return currendDay.records?.find(r => r.endTime == undefined);
        } else {
            return undefined;
        }
    }
);

export const selectCurrentComment = createSelector(
    selectCurrentDay,
    (currendDay): string => {
        if (currendDay != undefined) {
            return currendDay.comment;
        } else {
            return '';
        }
    }
);

export const selectAccountedYears = createSelector(
    selectAccounting,
    (accounting) => Array.from(new Set(accounting.months.map(it => it.year)).values()).sort((v1, v2) => v1 - v2)
);

export const selectAccountedMonths = createSelector(
    selectAccounting,
    selectAccountedYears,
    (accounting, years) => years.map(y => ({ year: y, months: accounting.months.filter(m => m.year === y).map(m => m.month).sort((m1, m2) => m1 - m2) }))
);

export const selectOverhours = createSelector(
    selectAccounting,
    (acc) => acc.overhours
);