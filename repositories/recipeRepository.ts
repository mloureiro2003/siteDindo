import { File } from "../services/file.js";
import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { Recipe } from "../models/recipe.js";

export class RecipeRepository {
    private static FILE_PATH = "recipe.json";

    getAll(): Recipe[] {
        const rawData: { name: string, code: Code, recipeType: RecipeType, ingredients: IngredientRecipe[], steps: string[] }[] = File.getFileContent(RecipeRepository.FILE_PATH);
        return rawData.map(item => new Recipe(item.name, item.code, item.recipeType, item.ingredients, item.steps));
    }

    create(name: string, code: Code, recipeType: RecipeType, ingredients: IngredientRecipe[], steps: string[]): Recipe {
        return new Recipe(name, code, recipeType, ingredients, steps);
    }

    delete(recipe: Recipe[], target: Recipe): Recipe[] {
        return recipe.filter(r => r.getCode() !== target.getCode());
    }
}