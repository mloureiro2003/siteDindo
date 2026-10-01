export class Recipe {
    code;
    recipe;
    recipeType;
    ingredients;
    steps;
    /** `steps` is the HTML produced by the Quill editor. */
    constructor(code, recipe, recipeType, ingredients, steps) {
        this.code = code;
        this.recipe = recipe;
        this.recipeType = recipeType;
        this.ingredients = ingredients;
        this.steps = steps;
    }
    getRecipe() {
        return this.recipe;
    }
    getCode() {
        return this.code;
    }
    getRecipeType() {
        return this.recipeType;
    }
    getIngredients() {
        return [...this.ingredients];
    }
    getSteps() {
        return this.steps;
    }
    setRecipe(newName) {
        this.recipe = newName;
    }
    setCode(newCode) {
        this.code = newCode;
    }
    setRecipeType(newRecipeType) {
        this.recipeType = newRecipeType;
    }
    setIngredients(newIngredients) {
        this.ingredients = [...newIngredients];
    }
    addIngredient(newIngredient) {
        this.ingredients.push(newIngredient);
    }
    setSteps(newSteps) {
        this.steps = newSteps;
    }
}
//# sourceMappingURL=recipe.js.map