import { BaseController } from "./baseController.js";
import { RecipeTypeRepository } from "../repositories/recipeTypeRepository.js";
import { RecipeType } from "../models/recipeType.js";
import { Code } from "../models/code.js";
import { attachAutoCode, type AutoCodeHandle } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
import type { TableColumn } from "../components/tableRenderer.js";

export class RecipeTypeController extends BaseController<RecipeType> {
    private codeInput: HTMLInputElement | null = null;
    private valueInput: HTMLInputElement | null = null;
    private autoCode: AutoCodeHandle | null = null;

    constructor(repository: RecipeTypeRepository) {
        super("recipeType-register", "recipeType-search", "form-recipeType", "table-recipeType", repository);
    }

    protected getName(recipeType: RecipeType): string { return recipeType.getRecipeType(); }

    protected override bindElements(): void {
        this.codeInput = document.getElementById("recipeType-code") as HTMLInputElement | null;
        this.valueInput = document.getElementById("recipeType-recipeType") as HTMLInputElement | null;

        if (this.codeInput && this.valueInput) {
            this.autoCode = attachAutoCode(
                this.codeInput,
                this.valueInput,
                () => this.items.map((item) => item.getCode().getCode()),
                () => this.editingItem !== null
            );
        }
    }

    protected getTableColumns(): TableColumn<RecipeType>[] {
        return [
            { getValue: (recipeType) => recipeType.getCode().getCode() },
            { getValue: (recipeType) => recipeType.getRecipeType() },
        ];
    }

    protected buildEntityFromForm(): RecipeType | null {
        if (!this.codeInput || !this.valueInput) return null;

        const value = this.valueInput.value.trim();
        if (!value) {
            alert("Preencha a descrição");
            return null;
        }

        const code = this.codeInput.value.trim().toUpperCase()
            || generateCode(value, this.items.map((item) => item.getCode().getCode()));
        this.codeInput.value = code;

        return new RecipeType(new Code(code), value);
    }

    protected populateForm(recipeType: RecipeType): void {
        if (!this.codeInput || !this.valueInput) return;

        this.codeInput.value = recipeType.getCode().getCode();
        this.valueInput.value = recipeType.getRecipeType();
    }

    protected override cancelEdit(): void {
        super.cancelEdit();
        this.autoCode?.reset();
    }

    protected getEntityLabel(recipeType: RecipeType): string {
        return `Tipo de Receita "${recipeType.getRecipeType()}"`;
    }
}
