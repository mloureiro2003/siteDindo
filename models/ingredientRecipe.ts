import { MeasuringUnit } from "../models/measuringUnit"
import { Ingredient } from "../models/ingredient"

export class IngredientRecipe {
    constructor(
        private ingredient: Ingredient,
        private measuringUnit: MeasuringUnit, 
        private unit: number
    ) {}

    getName(): string {
        return this.ingredient.getName();
    }


    getMeasuringUnit(): MeasuringUnit{
        return this.measuringUnit;
    }

    getUnit(): number {
        return this.unit;
    }

    setIngredient(newIngredient: Ingredient): void {
        this.ingredient = newIngredient;
    }

    setMeasuringUnit(newMeasuringUnit: MeasuringUnit): void {
        this.measuringUnit = newMeasuringUnit;
    }

    setUnit(newUnit: number): void {
        this.unit = newUnit;
    }
}