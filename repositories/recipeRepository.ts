import { Firestore } from "firebase/firestore";
import { Code } from "../models/code";
import { Recipe } from "../models/recipe";
import { BaseRepository } from "./baseRepository";

export class RecipeRepository extends BaseRepository<Recipe> {
    constructor(db: Firestore) {
        super (db, "recipe")
    }

    protected getId(item: Recipe): string {
        return item.getCode().getCode();
    }

    protected mapToDomain(id: string, data: any): Recipe {
        return new Recipe(new Code(id), data.recipe, data.recipeType, data.ingredient, data.steps);
    }

    protected mapToDatabase(item: Recipe) {
        return {
            code: item.getCode().getCode(),
            recipe: item.getRecipe(),
            recipeType: item.getRecipeType(),
            ingredient: item.getIngredients(),
            steps: item.getSteps()
        };
    }
}