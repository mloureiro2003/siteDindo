import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup"

export class Ingredient {
    constructor(
        private code: Code,
        private ingredient: string,
        private foodGroup: FoodGroup, 
        private synonym?: string
    ){}

    getIngredient(): string {
        return this.ingredient;
    }

    getFoodGroup(): FoodGroup {
        return this.foodGroup;
    }

    getCode(): Code {
        return this.code;
    }

    getSynonym(): string {
        return this.synonym ?? "";
    }

    setIngredient(newName: string): void {
        this.ingredient = newName;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }

    setFoodGroup(newFoodGroup: FoodGroup): void {
        this.foodGroup = newFoodGroup;
    }

    setSynonym (newSynonym: string): void {
        this.synonym = newSynonym;
    }
}