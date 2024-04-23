import { createActionGroup, emptyProps } from "@ngrx/store";

export const globalActions = createActionGroup({
    source: 'App',
    events: {
        'Start': emptyProps()
    }
})