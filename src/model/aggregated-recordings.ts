export interface AggregatedProjectRecordings {
    readonly totalWorkingHours: number;
    readonly workingHoursByTask: { [key: string]: number };
}

export interface AggregatedRecordings {

    readonly start: Date;
    readonly end: Date;
    readonly totalWorkingHours: number;
    readonly totalPauseHours: number;
    readonly hoursByProjectAndTask: {[key: string]: AggregatedProjectRecordings};
    readonly comment: string;
}