import { BaseController } from "./baseController.js";
import { IngredientRepository } from "../repositories/ingredientRepository.js";
import { FoodGroupRepository } from "../repositories/foodGroupRepository.js";
import { Ingredient } from "../models/ingredient.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Code } from "../models/code.js";
import { fillSelect } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
import type { TableColumn } from "../components/tableRenderer.js";

/**
 * Ingredients don't show a code to the person (only measuring units, recipe types and food
 * groups do). A code is still generated from the name and stored as the Firestore document id,
 * it's just never displayed, and it doesn't change once assigned.
 */
export class IngredientController extends BaseController<Ingredient> {
    private nameInput: HTMLInputElement | null = null;
    private synonymInput: HTMLInputElement | null = null;
    private foodGroupSelector: HTMLSelectElement | null = null;
    private specificationsInput: HTMLTextAreaElement | null = null;
    private availableFoodGroups: FoodGroup[] = [];

    constructor(
        repository: IngredientRepository,
        private foodGroupRepository: FoodGroupRepository
    ) {
        super("ingredient-register", "ingredient-search", "form-ingredient", "table-ingredients", repository);
    }

    protected getName(ingredient: Ingredient): string { return ingredient.getIngredient(); }

    protected override bindElements(): void {
        this.nameInput = document.getElementById("ingredient-ingredient") as HTMLInputElement | null;
        this.synonymInput = document.getElementById("ingredient-synonym") as HTMLInputElement | null;
        this.foodGroupSelector = document.getElementById("ingredient-foodGroup") as HTMLSelectElement | null;
        this.specificationsInput = document.getElementById("ingredient-specifications") as HTMLTextAreaElement | null;
    }

    protected override async loadLookups(): Promise<void> {
        if (!this.foodGroupSelector) return;

        this.availableFoodGroups = await this.foodGroupRepository.getAll();

        fillSelect(
            this.foodGroupSelector,
            this.availableFoodGroups
                .slice()
                .sort((a, b) => a.getFoodGroup().localeCompare(b.getFoodGroup()))
                .map((foodGroup) => ({
                    value: foodGroup.getCode().getCode(),
                    label: `${foodGroup.getCode().getCode()} - ${foodGroup.getFoodGroup()}`,
                }))
        );
    }

    protected getTableColumns(): TableColumn<Ingredient>[] {
        return [
            { getValue: (ingredient) => ingredient.getIngredient() },
            { getValue: (ingredient) => ingredient.getSynonym() },
            { getValue: (ingredient) => ingredient.getFoodGroup().getFoodGroup() },
            { getValue: (ingredient) => ingredient.getSpecification() },
        ];
    }

    protected buildEntityFromForm(): Ingredient | null {
        if (!this.nameInput || !this.foodGroupSelector) return null;

        const name = this.nameInput.value.trim();
        const synonym = this.synonymInput?.value.trim() ?? "";
        const specifications = this.specificationsInput?.value.trim() ?? "";
        const groupCode = this.foodGroupSelector.value;

        if (!name || !groupCode) {
            alert("Preencha o nome e selecione o grupo alimentar");
            return null;
        }

        const foodGroup = this.availableFoodGroups.find((fg) => fg.getCode().getCode() === groupCode);
        if (!foodGroup) {
            alert("Grupo alimentar selecionado é inválido. Recarregue a página e tente novamente");
            return null;
        }

        const code = this.editingItem?.getCode().getCode()
            ?? generateCode(name, this.items.map((item) => item.getCode().getCode()));

        return new Ingredient(new Code(code), name, foodGroup, synonym, specifications);
    }

    protected populateForm(ingredient: Ingredient): void {
        if (!this.nameInput || !this.foodGroupSelector) return;

        this.nameInput.value = ingredient.getIngredient();
        if (this.synonymInput) this.synonymInput.value = ingredient.getSynonym();
        if (this.specificationsInput) this.specificationsInput.value = ingredient.getSpecification();
        this.foodGroupSelector.value = ingredient.getFoodGroup().getCode().getCode();
    }

    protected getEntityLabel(ingredient: Ingredient): string {
        return `Ingrediente "${ingredient.getIngredient()}"`;
    }
}
