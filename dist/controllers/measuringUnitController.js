import { BaseController } from "./baseController.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { Code } from "../models/code.js";
import { attachAutoCode } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
export class MeasuringUnitController extends BaseController {
    codeInput = null;
    valueInput = null;
    quantifiableInput = null;
    autoCode = null;
    constructor(repository) {
        super("unit-register", "unit-search", "form-unit", "table-units", repository);
    }
    getName(unit) { return unit.getUnit(); }
    bindElements() {
        this.codeInput = document.getElementById("unit-code");
        this.valueInput = document.getElementById("unit-unit");
        this.quantifiableInput = document.getElementById("unit-quantifiable");
        if (this.codeInput && this.valueInput) {
            this.autoCode = attachAutoCode(this.codeInput, this.valueInput, () => this.items.map((item) => item.getCode().getCode()), () => this.editingItem !== null);
        }
    }
    getTableColumns() {
        return [
            { getValue: (unit) => unit.getCode().getCode() },
            { getValue: (unit) => unit.getUnit() },
        ];
    }
    buildEntityFromForm() {
        if (!this.codeInput || !this.valueInput)
            return null;
        const value = this.valueInput.value.trim();
        if (!value) {
            alert("Preencha a descrição");
            return null;
        }
        const code = this.codeInput.value.trim().toUpperCase()
            || generateCode(value, this.items.map((item) => item.getCode().getCode()));
        this.codeInput.value = code;
        const quantifiable = this.quantifiableInput?.checked ?? true;
        return new MeasuringUnit(new Code(code), value, quantifiable);
    }
    populateForm(unit) {
        if (!this.codeInput || !this.valueInput)
            return;
        this.codeInput.value = unit.getCode().getCode();
        this.valueInput.value = unit.getUnit();
        if (this.quantifiableInput)
            this.quantifiableInput.checked = unit.isQuantifiable();
    }
    cancelEdit() {
        super.cancelEdit();
        this.autoCode?.reset();
    }
    getEntityLabel(unit) {
        return `Unidade de Medida "${unit.getUnit()}"`;
    }
}
//# sourceMappingURL=measuringUnitController.js.map