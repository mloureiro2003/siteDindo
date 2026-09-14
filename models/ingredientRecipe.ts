import { Code } from "./code.js";
import { Ingredient } from "./ingredient.js";
import { MeasuringUnit } from "./measuringUnit.js";

export class IngredientRecipe {
  private ingredient: Ingredient;
  private quantity: number;
  private unit: MeasuringUnit;

  constructor(ingredient: Ingredient, quantity: number, unit: MeasuringUnit) {
    this.ingredient = ingredient;
    this.quantity = quantity;
    this.unit = unit;
  }
  
  public getCode(): Code {
    return this.ingredient.getCode();
  }

  public getIngredient(): Ingredient {
    return this.ingredient;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnit(): MeasuringUnit {
    return this.unit;
  }
}