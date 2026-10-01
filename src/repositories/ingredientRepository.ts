import { Firestore } from "firebase/firestore";
import { Ingredient } from "../models/ingredient.js";
import { BaseRepository } from "./baseRepository.js";
import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";
import { FoodGroupRepository } from "./foodGroupRepository.js";

export class IngredientRepository extends BaseRepository<Ingredient> {
    constructor(db: Firestore, foodGroupRepository: FoodGroupRepository) {
        super(
            db,
            "ingredient",
            (code, data, foodGroupsByCode: Map<string, FoodGroup>) => {
                const foodGroup = foodGroupsByCode.get(data.foodGroupCode)
                    ?? new FoodGroup(new Code(data.foodGroupCode), "Grupo alimentar não encontrado");

                return new Ingredient(new Code(code), data.ingredient, foodGroup, data.synonym, data.specifications);
            },
            (ingredient) => ({
                ingredient: ingredient.getIngredient(),
                foodGroupCode: ingredient.getFoodGroup().getCode().getCode(),
                synonym: ingredient.getSynonym(),
                specifications: ingredient.getSpecification(),
            }),
            async () => {
                const foodGroups = await foodGroupRepository.getAll();
                return new Map(foodGroups.map((foodGroup) => [foodGroup.getCode().getCode(), foodGroup]));
            }
        );
    }
}
