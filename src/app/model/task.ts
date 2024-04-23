import { Project } from "./project";

export class Task {

    constructor(readonly project: string, readonly name: string) { }

    isSame(other: Task): boolean {
        return this.name === other.name && this.project === other.project;
    }
}