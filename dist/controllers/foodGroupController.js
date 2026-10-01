import { BaseController } from "./baseController.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Code } from "../models/code.js";
import { attachAutoCode } from "../components/formHelpers.js";
import { generateCode } from "../components/codeGenerator.js";
export class FoodGroupController extends BaseController {
    codeInput = null;
    valueInput = null;
    autoCode = null;
    constructor(repository) {
        super("foodGroup-register", "foodGroup-search", "form-foodGroup", "table-foodGroup", repository);
    }
    getName(foodGroup) { return foodGroup.getFoodGroup(); }
    bindElements() {
        this.codeInput = document.getElementById("foodGroup-code");
        this.valueInput = document.getElementById("foodGroup-foodGroup");
        if (this.codeInput && this.valueInput) {
            this.autoCode = attachAutoCode(this.codeInput, this.valueInput, () => this.items.map((item) => item.getCode().getCode()), () => this.editingItem !== null);
        }
    }
    getTableColumns() {
        return [
            { getValue: (foodGroup) => foodGroup.getCode().getCode() },
            { getValue: (foodGroup) => foodGroup.getFoodGroup() },
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
        return new FoodGroup(new Code(code), value);
    }
    populateForm(foodGroup) {
        if (!this.codeInput || !this.valueInput)
            return;
        this.codeInput.value = foodGroup.getCode().getCode();
        this.valueInput.value = foodGroup.getFoodGroup();
    }
    cancelEdit() {
        super.cancelEdit();
        this.autoCode?.reset();
    }
    getEntityLabel(foodGroup) {
        return `Grupo Alimentar "${foodGroup.getFoodGroup()}"`;
    }
}
//# sourceMappingURL=foodGroupController.js.map