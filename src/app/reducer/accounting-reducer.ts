import { createReducer, on } from "@ngrx/store";
import { accountingActions } from "../action/accounting-actions";
import { AccountingState } from "../state/accounting-state";

const initialAccountingState: AccountingState = {
    activeDay: undefined,
    months: [],
    overhours: 0,
    currentTime: new Date().getTime()
};

function loadAccountings(_: AccountingState, action: AccountingState): AccountingState {
    return action;
}

export const accountingReducer = createReducer(
    initialAccountingState,
    on(accountingActions.load, loadAccountings)
);