import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup"

export class Ingredient {
    constructor(
        private code: Code,
        private name: string,
        private foodGroup: FoodGroup, 
        private synonym?: string
    ){}

    getName(): string {
        return this.name;
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

    setName(newName: string): void {
        this.name = newName;
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