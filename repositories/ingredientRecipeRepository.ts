import { File } from "../services/file.js";
import { Code } from "../models/code.js";
import { Ingredient } from "../models/ingredient.js";
import { FoodGroup } from "../models/foodGroup.js";

export class IngredientRepository {
    private static FILE_PATH = "ingredient.json";

    getAll(): Ingredient[] {
        const rawData: { name: string, foodGroup: FoodGroup, code: Code, synonym?: string }[] = File.getFileContent(IngredientRepository.FILE_PATH);
        return rawData.map(item => new Ingredient(item.name, item.foodGroup, item.code, item.synonym));
    }

    create(name: string, foodGroup: FoodGroup, code: Code, synonym?: string): Ingredient {
        return new Ingredient(name, foodGroup, code, synonym);
    }

    delete(ingredient: Ingredient[], target: Ingredient): Ingredient[] {
        return ingredient.filter(ing => ing.getCode() !== target.getCode());
    }
}