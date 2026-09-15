import { BaseController } from "./baseController.js";
import { FoodGroupRepository } from "../repositories/foodGroupRepository.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Code } from "../models/code.js";

export class FoodGroupController extends BaseController<FoodGroup> {
    private codeInput: HTMLInputElement | null = null;
    private valueInput: HTMLInputElement | null = null;

    constructor(private repository: FoodGroupRepository) {
        super("foodGroup-register", "foodGroup-search", "form-foodGroup", "table-foodGroup");   
    }

    override async init(): Promise<void> {
        this.codeInput = document.getElementById("foodGroup-code") as HTMLInputElement | null;
        this.valueInput = document.getElementById("foodGroup-foodGroup") as HTMLInputElement | null;

        await super.init();
    }

    protected getTableColumns() {
        return [
            { getValue: (foodGroup: FoodGroup) => foodGroup.getCode().getCode() },
            { getValue: (foodGroup: FoodGroup) => foodGroup.getFoodGroup() },
        ];
    }

    protected async getAllItems(): Promise<FoodGroup[]> {
        return await this.repository.getAll();
    }

    protected async save(): Promise<void> {
        if (!this.codeInput || !this.valueInput) return;

        const codeValue = this.codeInput.value.trim().toUpperCase();
        const value = this.valueInput.value.trim();
        if (!codeValue || !value) return alert("Preencha todos os campos");
    
        const newCode = new Code(codeValue);
        const newFoodGroup = new FoodGroup(newCode, value)

        try {
            if (this.editingItem && this.editingItem.getCode().getCode() !== codeValue) {
                await this.repository.delete(this.editingItem);
            }

            await this.repository.save(newFoodGroup);
            alert(`Unidade "${value}" salva com sucesso!`);

            this.cancelEdit();
            this.showViews();
            await this.refreshTable();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message || error}`);
        }
    }

    protected startEdit(foodGroup: FoodGroup): void {
        if (!this.codeInput || !this.valueInput) return;

        this.editingItem = foodGroup;
        this.codeInput.value = foodGroup.getCode().getCode();
        this.valueInput.value = foodGroup.getFoodGroup();

        if (this.submitButton) {
            this.submitButton.textContent = "Atualizar Grupo Alimentar";
        }

        this.showViews();
        this.codeInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    protected async remove(foodGroup: FoodGroup): Promise<void> {
        if (!confirm(`Excluir o grupo alimentar "${foodGroup.getFoodGroup()}"?`)) return;

        try {
            await this.repository.delete(foodGroup);
            this.cancelEdit();
            await this.refreshTable()
        } catch (error: any) {
            alert(`Erro ao excluir: ${error.message || error}`);
        }
    }
}