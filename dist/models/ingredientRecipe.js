/**
 * A line of a recipe: one ingredient + how much of it + in which unit.
 * Quantity is null when the unit takes no amount ("quanto satis" / "ad libitum").
 * It has no code of its own; it is identified by the ingredient it refers to.
 */
export class IngredientRecipe {
    ingredient;
    quantity;
    unit;
    constructor(ingredient, quantity, unit) {
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.unit = unit;
    }
    getCode() {
        return this.ingredient.getCode();
    }
    getIngredient() {
        return this.ingredient;
    }
    getQuantity() {
        return this.quantity;
    }
    getUnit() {
        return this.unit;
    }
    setIngredient(newIngredient) {
        this.ingredient = newIngredient;
    }
    setQuantity(newQuantity) {
        this.quantity = newQuantity;
    }
    setUnit(newUnit) {
        this.unit = newUnit;
    }
}
//# sourceMappingURL=ingredientRecipe.js.map