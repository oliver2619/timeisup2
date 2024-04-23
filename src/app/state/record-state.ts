export interface RecordState {

    readonly startTime: number;
    readonly endTime: number | undefined;
    readonly hours: number;
    readonly project: string;
    readonly task: string;
}