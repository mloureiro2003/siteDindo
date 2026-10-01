import { Code } from "./code.js";
import { RecipeType } from "./recipeType.js";
import { IngredientRecipe } from "./ingredientRecipe.js";

export class Recipe {
    /** `steps` is the HTML produced by the Quill editor. */
    constructor(
        private code: Code,
        private recipe: string,
        private recipeType: RecipeType,
        private ingredients: IngredientRecipe[],
        private steps: string
    ) {}

    getRecipe(): string {
        return this.recipe;
    }

    getCode(): Code {
        return this.code;
    }

    getRecipeType(): RecipeType {
        return this.recipeType;
    }

    getIngredients(): IngredientRecipe[] {
        return [...this.ingredients];
    }

    getSteps(): string {
        return this.steps;
    }

    setRecipe(newName: string): void {
        this.recipe = newName;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }

    setRecipeType(newRecipeType: RecipeType): void {
        this.recipeType = newRecipeType;
    }

    setIngredients(newIngredients: IngredientRecipe[]): void {
        this.ingredients = [...newIngredients];
    }

    addIngredient(newIngredient: IngredientRecipe): void {
        this.ingredients.push(newIngredient);
    }

    setSteps(newSteps: string): void {
        this.steps = newSteps;
    }
}
