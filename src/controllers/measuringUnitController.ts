import { BaseController } from "./baseController.js";
import { MeasuringUnitRepository } from "../repositories/measuringUnitRepository.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { Code } from "../models/code.js";
import { attachAutoCode, type AutoCodeHandle } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
import type { TableColumn } from "../components/tableRenderer.js";

export class MeasuringUnitController extends BaseController<MeasuringUnit> {
    private codeInput: HTMLInputElement | null = null;
    private valueInput: HTMLInputElement | null = null;
    private quantifiableInput: HTMLInputElement | null = null;
    private autoCode: AutoCodeHandle | null = null;

    constructor(repository: MeasuringUnitRepository) {
        super("unit-register", "unit-search", "form-unit", "table-units", repository);
    }

    protected getName(unit: MeasuringUnit): string { return unit.getUnit(); }

    protected override bindElements(): void {
        this.codeInput = document.getElementById("unit-code") as HTMLInputElement | null;
        this.valueInput = document.getElementById("unit-unit") as HTMLInputElement | null;
        this.quantifiableInput = document.getElementById("unit-quantifiable") as HTMLInputElement | null;

        if (this.codeInput && this.valueInput) {
            this.autoCode = attachAutoCode(
                this.codeInput,
                this.valueInput,
                () => this.items.map((item) => item.getCode().getCode()),
                () => this.editingItem !== null
            );
        }
    }

    protected getTableColumns(): TableColumn<MeasuringUnit>[] {
        return [
            { getValue: (unit) => unit.getCode().getCode() },
            { getValue: (unit) => unit.getUnit() },
        ];
    }

    protected buildEntityFromForm(): MeasuringUnit | null {
        if (!this.codeInput || !this.valueInput) return null;

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

    protected populateForm(unit: MeasuringUnit): void {
        if (!this.codeInput || !this.valueInput) return;

        this.codeInput.value = unit.getCode().getCode();
        this.valueInput.value = unit.getUnit();
        if (this.quantifiableInput) this.quantifiableInput.checked = unit.isQuantifiable();
    }

    protected override cancelEdit(): void {
        super.cancelEdit();
        this.autoCode?.reset();
    }

    protected getEntityLabel(unit: MeasuringUnit): string {
        return `Unidade de Medida "${unit.getUnit()}"`;
    }
}