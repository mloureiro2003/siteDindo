import { BaseController } from "./baseController.js";
import { RecipeTypeRepository } from "../repositories/recipeTypeRepository.js";
import { RecipeType } from "../models/recipeType.js";
import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";

export class RecipeTypeController extends BaseController<RecipeType> {
    private codeInput: HTMLInputElement | null = null;
    private valueInput: HTMLInputElement | null = null;

    constructor(private repository: RecipeTypeRepository) {
        super("recipeType-register", "recipeType-search", "form-recipeType", "table-recipeType")
    }

    override async init(): Promise<void> {
        this.codeInput = document.getElementById("recipeType-code") as HTMLInputElement | null;
        this.valueInput = document.getElementById("recipeType-recipeType") as HTMLInputElement | null;

        await super.init();
    }

    protected getTableColumns() {
        return [
            { getValue: (recipeType: RecipeType) => recipeType.getCode().getCode() },
            { getValue: (recipeType: RecipeType) => recipeType.getRecipeType() },
        ];
    }

    protected async getAllItems(): Promise<RecipeType[]> {
        return await this.repository.getAll();
    }

    protected async save(): Promise<void> {
        if (!this.codeInput || !this.valueInput) return;

        const codeValue = this.codeInput.value.trim().toUpperCase();
        const value = this.valueInput.value.trim();
        if (!codeValue || !value) return alert("Preencha todos os campos ");

        const newCode = new Code(codeValue);
        const newRecipeType = new RecipeType(newCode, value);

        try {
            if (this.editingItem && this.editingItem.getCode().getCode() !== codeValue) {
                await this.repository.delete(this.editingItem);
            }

            await this.repository.save(newRecipeType);
            alert(`Unidade "${value}" salva com sucesso!`);

            this.cancelEdit();
            this.showViews();
            await this.refreshTable();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message || error}`);
        }
    }

    protected startEdit(recipeType: RecipeType): void {
        if (!this.codeInput || !this.valueInput) return;

        this.editingItem = recipeType;
        this.codeInput.value = recipeType.getCode().getCode();
        this.valueInput.value = recipeType.getRecipeType();

        if (this.submitButton) {
            this.submitButton.textContent = "Atualizar Tipo de Receita";
        }

        this.showViews();
        this.codeInput.scrollIntoView({ behavior: "smooth", block: "center"});
    }

    protected async remove(recipeType: RecipeType): Promise<void> {
        if (!confirm(`Excluir o tipo de receita "${recipeType.getRecipeType()}"?`)) return;
    
        try {
            await this.repository.delete(recipeType);
            this.cancelEdit();
            await this.refreshTable()
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message || error}`)
        }
    }
}