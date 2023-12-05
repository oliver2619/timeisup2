import { RecordJson } from "./record-json";

export interface WorkingdayJson {

    readonly day: number;
    readonly records: RecordJson[];
    readonly comment: string | undefined;
}