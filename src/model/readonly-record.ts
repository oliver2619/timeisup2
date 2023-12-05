export interface ReadonlyRecord {
    readonly start: Date;
    readonly end?: Date;
    readonly task: string;
    readonly project: string;
}