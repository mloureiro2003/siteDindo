import { BaseController } from "./baseController.js";
import { RecipeType } from "../models/recipeType.js";
import { Code } from "../models/code.js";
import { attachAutoCode } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
export class RecipeTypeController extends BaseController {
    codeInput = null;
    valueInput = null;
    autoCode = null;
    constructor(repository) {
        super("recipeType-register", "recipeType-search", "form-recipeType", "table-recipeType", repository);
    }
    getName(recipeType) { return recipeType.getRecipeType(); }
    bindElements() {
        this.codeInput = document.getElementById("recipeType-code");
        this.valueInput = document.getElementById("recipeType-recipeType");
        if (this.codeInput && this.valueInput) {
            this.autoCode = attachAutoCode(this.codeInput, this.valueInput, () => this.items.map((item) => item.getCode().getCode()), () => this.editingItem !== null);
        }
    }
    getTableColumns() {
        return [
            { getValue: (recipeType) => recipeType.getCode().getCode() },
            { getValue: (recipeType) => recipeType.getRecipeType() },
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
        return new RecipeType(new Code(code), value);
    }
    populateForm(recipeType) {
        if (!this.codeInput || !this.valueInput)
            return;
        this.codeInput.value = recipeType.getCode().getCode();
        this.valueInput.value = recipeType.getRecipeType();
    }
    cancelEdit() {
        super.cancelEdit();
        this.autoCode?.reset();
    }
    getEntityLabel(recipeType) {
        return `Tipo de Receita "${recipeType.getRecipeType()}"`;
    }
}
//# sourceMappingURL=recipeTypeController.js.map