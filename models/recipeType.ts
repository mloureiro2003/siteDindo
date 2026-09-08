import { Code } from "@models/code";

export class RecipeType {
    constructor(
        private value: string,
        private code: Code
    ) {}

    getValue(): string {
        return this.value;
    }

    getCode(): Code {
        return this.code;
    }
}