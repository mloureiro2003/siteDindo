import { Code } from "../models/code.js";

export class FoodGroup {
    constructor(
        private code: Code,
        private foodGroup: string
        
    ) {}

    getFoodGroup(): string {
        return this.foodGroup;
    }

    getCode(): Code {
        return this.code;
    }

    setFoodGroup(newFoodGroup: string): void {
        this.foodGroup = newFoodGroup;
    }

    setCode(newCode: Code): void {
        this.code = newCode;
    }
}