import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { Ingredient } from "../models/ingredient.js";
import { BaseRepository } from "./baseRepository.js";

export class IngredientRepository extends BaseRepository<Ingredient> {
    constructor(db: Firestore) {
        super(db, "ingredient")
    }

    protected getId(item: Ingredient): string {
        return item.getCode().getCode();
    } 
    
    protected mapToDomain(id: string, data: any): Ingredient {
        return new Ingredient(new Code(id), data.ingredient, data.foodGroup, data.synonym)
    }

    protected mapToDatabase(item: Ingredient): any {
        return {
            code: item.getCode().getCode(),
            ingredient: item.getIngredient(),
            foodGroup: item.getFoodGroup(),
            synonym: item.getSynonym()
        }
    }
}