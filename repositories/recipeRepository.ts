import { File } from "@services/file";
import { Code } from "@models/code";
import { RecipeType } from "@models/recipeType"
import { IngredientRecipe } from "@models/ingredientRecipe"
import { Recipe } from "@models/recipe"

export class RecipeRepository {
    private static FILE_PATH = "recipe.json";

    getAll(): Recipe[]{
        const rawData: { name: string, code: Code, recipeType: RecipeType, ingredients: IngredientRecipe[], steps: string[]}[] = File.getFileContent(RecipeRepository.FILE_PATH)
        return rawData.map(item => new Recipe(item.name, item.code, item.recipeType, item.ingredients, item.steps));
    }
    
    create(name: string, code: Code, recipeType: RecipeType, ingredients: IngredientRecipe[], steps: string[]): Recipe{
        return new Recipe(name, code, recipeType, ingredients, steps);
    }

    delete(recipe: Recipe[], target: Recipe): Recipe[] {
        return recipe.filter(recipe => recipe.getCode() !== target.getCode());
    }
}