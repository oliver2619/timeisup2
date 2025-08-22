import { TaskJson } from "./task-json";

export interface ProjectJson {

    readonly tasks: Record<string, TaskJson>;
    readonly active: boolean | undefined;
    readonly favoriteTask: string | undefined;
}
