import { BaseController } from "./baseController.js";
import { FoodGroupRepository } from "../repositories/foodGroupRepository.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Code } from "../models/code.js";
import { attachAutoCode, type AutoCodeHandle } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
import type { TableColumn } from "../components/tableRenderer.js";

export class FoodGroupController extends BaseController<FoodGroup> {
    private codeInput: HTMLInputElement | null = null;
    private valueInput: HTMLInputElement | null = null;
    private autoCode: AutoCodeHandle | null = null;

    constructor(repository: FoodGroupRepository) {
        super("foodGroup-register", "foodGroup-search", "form-foodGroup", "table-foodGroup", repository);
    }

    protected getName(foodGroup: FoodGroup): string { return foodGroup.getFoodGroup(); }

    protected override bindElements(): void {
        this.codeInput = document.getElementById("foodGroup-code") as HTMLInputElement | null;
        this.valueInput = document.getElementById("foodGroup-foodGroup") as HTMLInputElement | null;

        if (this.codeInput && this.valueInput) {
            this.autoCode = attachAutoCode(
                this.codeInput,
                this.valueInput,
                () => this.items.map((item) => item.getCode().getCode()),
                () => this.editingItem !== null
            );
        }
    }

    protected getTableColumns(): TableColumn<FoodGroup>[] {
        return [
            { getValue: (foodGroup) => foodGroup.getCode().getCode() },
            { getValue: (foodGroup) => foodGroup.getFoodGroup() },
        ];
    }

    protected buildEntityFromForm(): FoodGroup | null {
        if (!this.codeInput || !this.valueInput) return null;

        const value = this.valueInput.value.trim();
        if (!value) {
            alert("Preencha a descrição");
            return null;
        }

        const code = this.codeInput.value.trim().toUpperCase()
            || generateCode(value, this.items.map((item) => item.getCode().getCode()));
        this.codeInput.value = code;

        return new FoodGroup(new Code(code), value);
    }

    protected populateForm(foodGroup: FoodGroup): void {
        if (!this.codeInput || !this.valueInput) return;

        this.codeInput.value = foodGroup.getCode().getCode();
        this.valueInput.value = foodGroup.getFoodGroup();
    }

    protected override cancelEdit(): void {
        super.cancelEdit();
        this.autoCode?.reset();
    }

    protected getEntityLabel(foodGroup: FoodGroup): string {
        return `Grupo Alimentar "${foodGroup.getFoodGroup()}"`;
    }
}
