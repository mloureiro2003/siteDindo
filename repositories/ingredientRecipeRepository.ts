import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { Ingredient } from "../models/ingredient.js";
import { BaseRepository } from "./baseRepository.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";

export class IngredientRecipeRepository extends BaseRepository<IngredientRecipe> {
    constructor (db: Firestore) {
        super(db, "ingredientRecipe");
    }

    protected getId(item: IngredientRecipe): string {
        return item.getIngredient().getCode().getValue();
    }

    protected mapToDomain(data: any): IngredientRecipe {
        return new IngredientRecipe(data.ingredient, data.quantity, data.unit);
    }

    protected mapToDatabase(item: IngredientRecipe): any {
        return {
            ingredient: item.getIngredient(),
            quantity: item.getQuantity(),
            unit: item.getUnit()
        };
    }
}