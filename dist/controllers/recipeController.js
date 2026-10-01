import { BaseController } from "./baseController.js";
import { Recipe } from "../models/recipe.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { Code } from "../models/code.js";
import { fillSelect } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
import { normalizeText } from "../components/html.js";
import { makeSearchable } from "../components/searchableSelect.js";
/**
 * Recipes don't show a code to the person (only measuring units, recipe types and food groups
 * do). A code is still generated from the name and stored as the Firestore document id, it's
 * just never displayed, and it doesn't change once assigned.
 */
export class RecipeController extends BaseController {
    recipeTypeRepository;
    ingredientRepository;
    measuringUnitRepository;
    quill;
    nameInput = null;
    recipeTypeSelector = null;
    ingredientsContainer = null;
    availableRecipeTypes = [];
    availableIngredients = [];
    availableUnits = [];
    searchTerm = "";
    constructor(repository, recipeTypeRepository, ingredientRepository, measuringUnitRepository, quill) {
        super("recipe-register", "recipe-search", "form-recipe", "table-recipe", repository);
        this.recipeTypeRepository = recipeTypeRepository;
        this.ingredientRepository = ingredientRepository;
        this.measuringUnitRepository = measuringUnitRepository;
        this.quill = quill;
    }
    getName(recipe) { return recipe.getRecipe(); }
    // ---------- setup ----------
    bindElements() {
        this.nameInput = document.getElementById("recipe-name");
        this.recipeTypeSelector = document.getElementById("recipe-type");
        this.ingredientsContainer = document.getElementById("list-ingredients-recipe");
        document.getElementById("btn-add-ingredient")?.addEventListener("click", () => this.createIngredientRow());
        document.getElementById("search-recipe")?.addEventListener("input", (event) => {
            this.searchTerm = event.target.value;
            this.renderTable();
        });
    }
    async loadLookups() {
        [this.availableRecipeTypes, this.availableIngredients, this.availableUnits] = await Promise.all([
            this.recipeTypeRepository.getAll(),
            this.ingredientRepository.getAll(),
            this.measuringUnitRepository.getAll(),
        ]);
        if (this.recipeTypeSelector) {
            fillSelect(this.recipeTypeSelector, this.availableRecipeTypes
                .slice()
                .sort((a, b) => a.getRecipeType().localeCompare(b.getRecipeType()))
                .map((type) => ({
                value: type.getCode().getCode(),
                label: `${type.getCode().getCode()} - ${type.getRecipeType()}`,
            })));
        }
        // Rows that already exist keep their selection; new data just becomes available.
        this.ingredientsContainer
            ?.querySelectorAll(".ingredient-row")
            .forEach((row) => {
            this.fillRowOptions(row);
            row.querySelector(".ingredient-unit")?.dispatchEvent(new Event("change"));
        });
        if (this.ingredientsContainer && !this.ingredientsContainer.querySelector(".ingredient-row")) {
            this.createIngredientRow();
        }
    }
    // ---------- ingredient rows ----------
    createIngredientRow(prefill) {
        if (!this.ingredientsContainer)
            return;
        const row = document.createElement("div");
        row.className = "ingredient-row";
        const codeField = document.createElement("input");
        codeField.type = "text";
        codeField.placeholder = "Cód";
        codeField.className = "ingredient-code";
        codeField.setAttribute("aria-label", "Código do ingrediente");
        const ingredientSelect = document.createElement("select");
        ingredientSelect.className = "ingredient-select";
        ingredientSelect.setAttribute("aria-label", "Ingrediente");
        ingredientSelect.add(new Option("Selecione o ingrediente...", ""));
        const quantityField = document.createElement("input");
        quantityField.type = "number";
        quantityField.step = "0.01";
        quantityField.min = "0.01";
        quantityField.placeholder = "Qtd";
        quantityField.className = "ingredient-qtd";
        quantityField.setAttribute("aria-label", "Quantidade");
        const unitSelect = document.createElement("select");
        unitSelect.className = "ingredient-unit";
        unitSelect.setAttribute("aria-label", "Unidade de medida");
        unitSelect.add(new Option("Unidade...", ""));
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn-delete";
        removeButton.textContent = "X";
        removeButton.title = "Remover ingrediente";
        // Typing a code selects the matching ingredient; picking one fills in the code.
        codeField.addEventListener("input", () => {
            const typed = codeField.value.trim().toUpperCase();
            const match = this.availableIngredients.find((i) => i.getCode().getCode().toUpperCase() === typed);
            ingredientSelect.value = match ? match.getCode().getCode() : "";
        });
        ingredientSelect.addEventListener("change", () => {
            codeField.value = ingredientSelect.value;
        });
        // Units that take no quantity ("quanto satis", "ad libitum") hide the quantity box.
        unitSelect.addEventListener("change", () => {
            const unit = this.availableUnits.find((u) => u.getCode().getCode() === unitSelect.value);
            const needsQuantity = !unit || unit.isQuantifiable();
            quantityField.style.display = needsQuantity ? "" : "none";
            if (!needsQuantity)
                quantityField.value = "";
        });
        removeButton.addEventListener("click", () => {
            row.remove();
            if (this.ingredientsContainer && !this.ingredientsContainer.querySelector(".ingredient-row")) {
                this.createIngredientRow();
            }
        });
        row.append(codeField, ingredientSelect, quantityField, unitSelect, removeButton);
        this.ingredientsContainer.appendChild(row);
        makeSearchable(ingredientSelect);
        makeSearchable(unitSelect);
        this.fillRowOptions(row);
        if (prefill) {
            ingredientSelect.value = prefill.ingredientCode;
            codeField.value = ingredientSelect.value; // "" if the ingredient no longer exists
            quantityField.value = prefill.quantity === null ? "" : String(prefill.quantity);
            unitSelect.value = prefill.unitCode;
            unitSelect.dispatchEvent(new Event("change"));
        }
    }
    fillRowOptions(row) {
        const ingredientSelect = row.querySelector(".ingredient-select");
        const unitSelect = row.querySelector(".ingredient-unit");
        if (ingredientSelect) {
            fillSelect(ingredientSelect, this.availableIngredients
                .slice()
                .sort((a, b) => a.getIngredient().localeCompare(b.getIngredient()))
                .map((ingredient) => ({
                value: ingredient.getCode().getCode(),
                label: `${ingredient.getCode().getCode()} - ${ingredient.getIngredient()}`,
            })));
        }
        if (unitSelect) {
            fillSelect(unitSelect, this.availableUnits
                .slice()
                .sort((a, b) => a.getUnit().localeCompare(b.getUnit()))
                .map((unit) => ({
                value: unit.getCode().getCode(),
                label: `${unit.getCode().getCode()} - ${unit.getUnit()}`,
            })));
        }
    }
    resetIngredientRows() {
        this.ingredientsContainer?.replaceChildren();
        this.createIngredientRow();
    }
    /**
     * Returns null (after alerting) when some row is invalid. Blank rows are ignored.
     * The quantity is only required when the chosen unit is quantifiable.
     */
    collectIngredients() {
        if (!this.ingredientsContainer)
            return null;
        const lines = [];
        const usedCodes = new Set();
        for (const row of this.ingredientsContainer.querySelectorAll(".ingredient-row")) {
            const ingredientCode = row.querySelector(".ingredient-select")?.value ?? "";
            const quantityText = row.querySelector(".ingredient-qtd")?.value ?? "";
            const unitCode = row.querySelector(".ingredient-unit")?.value ?? "";
            if (!ingredientCode && !quantityText && !unitCode)
                continue;
            if (!ingredientCode || !unitCode) {
                alert("Em cada ingrediente, informe o ingrediente e a unidade.");
                return null;
            }
            if (usedCodes.has(ingredientCode)) {
                alert("Um mesmo ingrediente foi adicionado mais de uma vez. Remova a linha repetida.");
                return null;
            }
            usedCodes.add(ingredientCode);
            const ingredient = this.availableIngredients.find((i) => i.getCode().getCode() === ingredientCode);
            const unit = this.availableUnits.find((u) => u.getCode().getCode() === unitCode);
            if (!ingredient || !unit) {
                alert("Ingrediente ou unidade inválidos. Recarregue a página e tente novamente.");
                return null;
            }
            // Units like "quanto satis" / "ad libitum" take no quantity.
            let quantity = null;
            if (unit.isQuantifiable()) {
                quantity = Number(quantityText);
                if (!(quantity > 0)) {
                    alert("Informe uma quantidade maior que zero para este ingrediente.");
                    return null;
                }
            }
            lines.push(new IngredientRecipe(ingredient, quantity, unit));
        }
        return lines;
    }
    // ---------- BaseController implementation ----------
    getTableColumns() {
        return [
            { getValue: (recipe) => recipe.getRecipe() },
            { getValue: (recipe) => recipe.getRecipeType().getRecipeType() },
            { getValue: (recipe) => recipe.getIngredients().length },
        ];
    }
    getVisibleItems() {
        const term = normalizeText(this.searchTerm.trim());
        if (!term)
            return this.items;
        return this.items.filter((recipe) => normalizeText(recipe.getRecipe()).includes(term) ||
            normalizeText(recipe.getRecipeType().getRecipeType()).includes(term));
    }
    buildEntityFromForm() {
        if (!this.nameInput || !this.recipeTypeSelector)
            return null;
        const name = this.nameInput.value.trim();
        const typeCode = this.recipeTypeSelector.value;
        if (!name || !typeCode) {
            alert("Preencha o nome e selecione o tipo da receita");
            return null;
        }
        const recipeType = this.availableRecipeTypes.find((t) => t.getCode().getCode() === typeCode);
        if (!recipeType) {
            alert("Tipo de receita inválido. Recarregue a página e tente novamente");
            return null;
        }
        const ingredients = this.collectIngredients();
        if (!ingredients)
            return null;
        if (ingredients.length === 0) {
            alert("Adicione pelo menos um ingrediente");
            return null;
        }
        const steps = this.quill && this.quill.getText().trim() !== "" ? this.quill.root.innerHTML : "";
        const code = this.editingItem?.getCode().getCode()
            ?? generateCode(name, this.items.map((item) => item.getCode().getCode()));
        return new Recipe(new Code(code), name, recipeType, ingredients, steps);
    }
    populateForm(recipe) {
        if (!this.nameInput || !this.recipeTypeSelector)
            return;
        this.nameInput.value = recipe.getRecipe();
        this.recipeTypeSelector.value = recipe.getRecipeType().getCode().getCode();
        this.ingredientsContainer?.replaceChildren();
        const lines = recipe.getIngredients();
        if (lines.length === 0)
            this.createIngredientRow();
        for (const line of lines) {
            this.createIngredientRow({
                ingredientCode: line.getIngredient().getCode().getCode(),
                quantity: line.getQuantity(),
                unitCode: line.getUnit().getCode().getCode(),
            });
        }
        if (this.quill) {
            this.quill.setText("");
            if (recipe.getSteps())
                this.quill.clipboard.dangerouslyPasteHTML(recipe.getSteps());
        }
    }
    cancelEdit() {
        super.cancelEdit();
        this.quill?.setText("");
        this.resetIngredientRows();
    }
    getEntityLabel(recipe) {
        return `Receita "${recipe.getRecipe()}"`;
    }
}
//# sourceMappingURL=recipeController.js.map