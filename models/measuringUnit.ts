import { Code } from "../models/code.js";

export class MeasuringUnit {
    constructor(
        private code: Code,
        private unit: string
    ) {}

    getUnit(): string {
        return this.unit;
    }

    getCode(): Code {
        return this.code;
    }

    setUnit(newValue: string): void {
        this.unit = newValue;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }
}