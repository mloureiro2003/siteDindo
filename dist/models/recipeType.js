export class RecipeType {
    code;
    recipeType;
    constructor(code, recipeType) {
        this.code = code;
        this.recipeType = recipeType;
    }
    getRecipeType() {
        return this.recipeType;
    }
    getCode() {
        return this.code;
    }
    setRecipeType(newRecipeType) {
        this.recipeType = newRecipeType;
    }
    setCode(newCode) {
        this.code = newCode;
    }
}
//# sourceMappingURL=recipeType.js.map