import { Code } from "./code.js";

export class MeasuringUnit {
    /**
     * `quantifiable` is false for units that take no amount ("quanto satis", "ad libitum"):
     * a recipe line using them is saved without a quantity.
     */
    constructor(
        private code: Code,
        private unit: string,
        private quantifiable: boolean = true
    ) {}

    getUnit(): string {
        return this.unit;
    }

    getCode(): Code {
        return this.code;
    }

    isQuantifiable(): boolean {
        return this.quantifiable;
    }

    setUnit(newValue: string): void {
        this.unit = newValue;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }

    setQuantifiable(value: boolean): void {
        this.quantifiable = value;
    }
}