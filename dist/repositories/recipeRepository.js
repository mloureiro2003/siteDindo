import { BaseRepository } from "./baseRepository.js";
import { Recipe } from "../models/recipe.js";
import { RecipeType } from "../models/recipeType.js";
import { Ingredient } from "../models/ingredient.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Code } from "../models/code.js";
/**
 * The ingredient lines are embedded in the recipe document (as an array of
 * codes + quantity), so the same ingredient can be used in many recipes.
 */
export class RecipeRepository extends BaseRepository {
    constructor(db, recipeTypeRepository, ingredientRepository, measuringUnitRepository) {
        super(db, "recipe", (code, data, context) => {
            const recipeType = context.types.get(data.recipeTypeCode)
                ?? new RecipeType(new Code(data.recipeTypeCode), "Tipo não encontrado");
            const stored = data.ingredients ?? [];
            const ingredients = stored.map((line) => {
                const ingredient = context.ingredients.get(line.ingredientCode)
                    ?? new Ingredient(new Code(line.ingredientCode), "Ingrediente não encontrado", new FoodGroup(new Code(""), "Grupo alimentar não encontrado"));
                const unit = context.units.get(line.unitCode)
                    ?? new MeasuringUnit(new Code(line.unitCode), line.unitCode);
                return new IngredientRecipe(ingredient, line.quantity ?? null, unit);
            });
            return new Recipe(new Code(code), data.recipe, recipeType, ingredients, data.steps ?? "");
        }, (recipe) => ({
            recipe: recipe.getRecipe(),
            recipeTypeCode: recipe.getRecipeType().getCode().getCode(),
            // Firestore accepts null but not undefined.
            ingredients: recipe.getIngredients().map((line) => ({
                ingredientCode: line.getIngredient().getCode().getCode(),
                quantity: line.getQuantity(),
                unitCode: line.getUnit().getCode().getCode(),
            })),
            steps: recipe.getSteps(),
        }), async () => {
            const [types, ingredients, units] = await Promise.all([
                recipeTypeRepository.getAll(),
                ingredientRepository.getAll(),
                measuringUnitRepository.getAll(),
            ]);
            return {
                types: new Map(types.map((item) => [item.getCode().getCode(), item])),
                ingredients: new Map(ingredients.map((item) => [item.getCode().getCode(), item])),
                units: new Map(units.map((item) => [item.getCode().getCode(), item])),
            };
        });
    }
}
//# sourceMappingURL=recipeRepository.js.map