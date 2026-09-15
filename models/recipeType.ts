import { Code } from "../models/code.js";

export class RecipeType {
    constructor(
        private code: Code,
        private recipeType: string,
    ) {}

    getRecipeType(): string {
        return this.recipeType;
    }

    getCode(): Code {
        return this.code;
    }

    setRecipeType(newRecipeType: string): void {
        this.recipeType = newRecipeType
    }

    setCode(newCode: Code): void {
        this.code = newCode
    }
}