import { Code } from "../models/code.js";

export class RecipeType {
    constructor(
        private code: Code,
        private value: string,
    ) {}

    getValue(): string {
        return this.value;
    }

    getCode(): Code {
        return this.code;
    }
}