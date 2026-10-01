export class MeasuringUnit {
    code;
    unit;
    quantifiable;
    /**
     * `quantifiable` is false for units that take no amount ("quanto satis", "ad libitum"):
     * a recipe line using them is saved without a quantity.
     */
    constructor(code, unit, quantifiable = true) {
        this.code = code;
        this.unit = unit;
        this.quantifiable = quantifiable;
    }
    getUnit() {
        return this.unit;
    }
    getCode() {
        return this.code;
    }
    isQuantifiable() {
        return this.quantifiable;
    }
    setUnit(newValue) {
        this.unit = newValue;
    }
    setCode(newCode) {
        this.code = newCode;
    }
    setQuantifiable(value) {
        this.quantifiable = value;
    }
}
//# sourceMappingURL=measuringUnit.js.map