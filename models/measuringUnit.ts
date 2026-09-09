import { Code } from "../models/code.js";

export class MeasuringUnit {
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

    setValue(newValue: string): void {
        this.value = newValue;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }
}