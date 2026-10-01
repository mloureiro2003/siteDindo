import { Code } from "./code.js";
import { Ingredient } from "./ingredient.js";
import { MeasuringUnit } from "./measuringUnit.js";

/**
 * A line of a recipe: one ingredient + how much of it + in which unit.
 * Quantity is null when the unit takes no amount ("quanto satis" / "ad libitum").
 * It has no code of its own; it is identified by the ingredient it refers to.
 */
export class IngredientRecipe {
  constructor(
    private ingredient: Ingredient,
    private quantity: number | null,
    private unit: MeasuringUnit
  ) {}

  getCode(): Code {
    return this.ingredient.getCode();
  }

  getIngredient(): Ingredient {
    return this.ingredient;
  }

  getQuantity(): number | null {
    return this.quantity;
  }

  getUnit(): MeasuringUnit {
    return this.unit;
  }

  setIngredient(newIngredient: Ingredient): void {
    this.ingredient = newIngredient;
  }

  setQuantity(newQuantity: number | null): void {
    this.quantity = newQuantity;
  }

  setUnit(newUnit: MeasuringUnit): void {
    this.unit = newUnit;
  }
}