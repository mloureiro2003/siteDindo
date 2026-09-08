import { RecipeType } from "@models/recipeType"
import { IngredientRecipe } from "@models/ingredientRecipe"
import { Code } from "@models/code";

export class Recipe {
    constructor(
        private name: string,
        private code: Code,
        private recipeType: RecipeType,
        private ingredients: IngredientRecipe[],
        private steps: string[]
    ) {}

    getName(): string {
        return this.name;
    }

    getCode(): Code {
        return this.code;
    }

    getRecipeType(): RecipeType {
        return this.recipeType
    }

    getIngredients(){
        for (const ingredientRecipe of this.ingredients){
            return ingredientRecipe
        }
    }

    getSteps(){
        for (const step of this.steps){
            return step
        }
    }

    setName(newName: string): void {
        this.name = newName;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }

    setRecipeType(newRecipeType: RecipeType): void {
        this.recipeType = newRecipeType;
    }

    setIngredient(newIngredient: IngredientRecipe, order: number): void {
        this.ingredients.splice(order, 0, newIngredient);
    }

    setStep(newStep: string, order: number): void {
        this.steps.splice(order, 0, newStep)
    }
}