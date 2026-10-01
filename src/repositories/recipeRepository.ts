import { Firestore } from "firebase/firestore";
import { BaseRepository } from "./baseRepository.js";
import { IngredientRepository } from "./ingredientRepository.js";
import { MeasuringUnitRepository } from "./measuringUnitRepository.js";
import { RecipeTypeRepository } from "./recipeTypeRepository.js";
import { Recipe } from "../models/recipe.js";
import { RecipeType } from "../models/recipeType.js";
import { Ingredient } from "../models/ingredient.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Code } from "../models/code.js";

interface RecipeContext {
    types: Map<string, RecipeType>;
    ingredients: Map<string, Ingredient>;
    units: Map<string, MeasuringUnit>;
}

/**
 * How an ingredient line is stored inside the recipe document.
 * quantity is null when the unit takes no amount ("quanto satis" / "ad libitum").
 */
interface StoredIngredientRecipe {
    ingredientCode: string;
    quantity: number | null;
    unitCode: string;
}

/**
 * The ingredient lines are embedded in the recipe document (as an array of
 * codes + quantity), so the same ingredient can be used in many recipes.
 */
export class RecipeRepository extends BaseRepository<Recipe> {
    constructor(
        db: Firestore,
        recipeTypeRepository: RecipeTypeRepository,
        ingredientRepository: IngredientRepository,
        measuringUnitRepository: MeasuringUnitRepository
    ) {
        super(
            db,
            "recipe",
            (code, data, context: RecipeContext) => {
                const recipeType = context.types.get(data.recipeTypeCode)
                    ?? new RecipeType(new Code(data.recipeTypeCode), "Tipo não encontrado");

                const stored: StoredIngredientRecipe[] = data.ingredients ?? [];
                const ingredients = stored.map((line) => {
                    const ingredient = context.ingredients.get(line.ingredientCode)
                        ?? new Ingredient(
                            new Code(line.ingredientCode),
                            "Ingrediente não encontrado",
                            new FoodGroup(new Code(""), "Grupo alimentar não encontrado")
                        );
                    const unit = context.units.get(line.unitCode)
                        ?? new MeasuringUnit(new Code(line.unitCode), line.unitCode);

                    return new IngredientRecipe(ingredient, line.quantity ?? null, unit);
                });

                return new Recipe(new Code(code), data.recipe, recipeType, ingredients, data.steps ?? "");
            },
            (recipe) => ({
                recipe: recipe.getRecipe(),
                recipeTypeCode: recipe.getRecipeType().getCode().getCode(),
                // Firestore accepts null but not undefined.
                ingredients: recipe.getIngredients().map((line): StoredIngredientRecipe => ({
                    ingredientCode: line.getIngredient().getCode().getCode(),
                    quantity: line.getQuantity(),
                    unitCode: line.getUnit().getCode().getCode(),
                })),
                steps: recipe.getSteps(),
            }),
            async (): Promise<RecipeContext> => {
                const [types, ingredients, units] = await Promise.all([
                    recipeTypeRepository.getAll(),
                    ingredientRepository.getAll(),
                    measuringUnitRepository.getAll(),
                ]);
                return {
                    types: new Map(types.map((item) => [item.getCode().getCode(), item] as const)),
                    ingredients: new Map(ingredients.map((item) => [item.getCode().getCode(), item] as const)),
                    units: new Map(units.map((item) => [item.getCode().getCode(), item] as const)),
                };
            }
        );
    }
}