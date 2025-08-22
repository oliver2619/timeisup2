import { TaskState } from "./task-state";

export interface ProjectState {

    readonly name: string;
    readonly active: boolean;
    readonly favorite: boolean;
    readonly useable: boolean;
    readonly tasks: Record<string, TaskState>;
    readonly favoriteTask: string | undefined;

}