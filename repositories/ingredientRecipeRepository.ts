import { Firestore } from "firebase/firestore";
import { BaseRepository } from "./baseRepository.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { Code } from "../models/code.js";

export class IngredientRecipeRepository extends BaseRepository<IngredientRecipe> {
    constructor (db: Firestore) {
        super(db, "ingredientRecipe");
    }

    protected getId(ingredientRecipe: IngredientRecipe): string {
        return ingredientRecipe.getIngredient().getCode().getCode();
    }

    protected mapToDomain(data: any): IngredientRecipe {
        return new IngredientRecipe(data.ingredient, data.quantity, data.unit)
    }

    protected mapToDatabase(ingredientRecipe: IngredientRecipe): any {
        return {
            code: ingredientRecipe.getCode(),
            ingredient: ingredientRecipe.getIngredient(),
            quantity: ingredientRecipe.getQuantity(),
            unit: ingredientRecipe.getUnit()
        };
    }
}