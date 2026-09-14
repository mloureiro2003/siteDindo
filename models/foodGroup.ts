import { Code } from "../models/code.js";

export class FoodGroup {
    constructor(
        private code: Code,
        private value: string
        
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