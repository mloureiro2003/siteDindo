import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { Ingredient } from "../models/ingredient.js";
import { BaseRepository } from "./baseRepository.js";

export class IngredientRepository extends BaseRepository<Ingredient> {
    constructor(db: Firestore) {
        super(db, "ingredient")
    }

    protected getId(item: Ingredient): string {
        return item.getCode().getValue();
    } 
    
    protected mapToDomain(id: string, data: any): Ingredient {
        return new Ingredient(new Code(id), data.name, data.foodGroup, data.synonym)
    }

    protected mapToDatabase(item: Ingredient): any {
        return {
            code: item.getCode().getValue(),
            name: item.getName(),
            FoodGroup: item.getFoodGroup(),
            synonym: item.getSynonym()
        }
    }
}