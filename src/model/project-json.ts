import { TaskJson } from "./task-json";

export interface ProjectJson {

    readonly tasks: { [key: string]: TaskJson };
}