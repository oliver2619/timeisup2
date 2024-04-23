import { createActionGroup, props } from "@ngrx/store";
import { AccountingState } from "../state/accounting-state";

export const accountingActions = createActionGroup({
    source: 'Accounting',
    events: {
        'Load': props<AccountingState>(),
    }
});