import { Code } from "./code.js";
import { Ingredient } from "./ingredient.js";
import { MeasuringUnit } from "./measuringUnit.js";

export class IngredientRecipe {
  private code: Code;
  private ingredient: Ingredient;
  private quantity: number;
  private unit: MeasuringUnit;

  constructor(ingredient: Ingredient, quantity: number, unit: MeasuringUnit) {
    this.ingredient = ingredient;
    this.code = this.ingredient.getCode()
    this.quantity = quantity;
    this.unit = unit;
  }
  
  getCode(): Code {
    return this.code;
  }

  getIngredient(): Ingredient {
    return this.ingredient;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getUnit(): MeasuringUnit {
    return this.unit;
  }

  setCode(newCode: Code): void {
    this.code = newCode;
  }

  setIngredient(newIngredient: Ingredient): void {
    this.ingredient = newIngredient;
  }

  setQuantity(newQuantity: number): void {
    this.quantity = newQuantity;
  }

  setUnit (newUnit: MeasuringUnit): void {
    this.unit = newUnit;
  }

}