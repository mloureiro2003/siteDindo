import { File } from "@services/file";
import { MeasuringUnit } from "@models/measuringUnit"
import { IngredientRecipe } from "@models/ingredientRecipe"
import { Ingredient } from "@models/ingredient"

export class IngredientRecipeRepository {
    private static FILE_PATH = "recipe.json"

    getAll(): IngredientRecipe[] {
        const rawData: { ingredient: Ingredient,  measuringUnit: MeasuringUnit, unit: number}[] = File.getFileContent(IngredientRecipeRepository.FILE_PATH)
        return rawData.map(item => new IngredientRecipe(item.ingredient, item.measuringUnit, item.unit))
    }

    create(ingredient: Ingredient, measuringUnit: MeasuringUnit, unit: number): IngredientRecipe{
        return new IngredientRecipe(ingredient, measuringUnit, unit);
    }

    delete(ingredientRecipe: IngredientRecipe[], target: IngredientRecipe): IngredientRecipe[] {
        return ingredientRecipe.filter(ingredientRecipe => ingredientRecipe.getName() !== target.getName())
    }
}