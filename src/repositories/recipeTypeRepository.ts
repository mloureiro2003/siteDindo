import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType.js";
import { BaseRepository } from "./baseRepository.js";

export class RecipeTypeRepository extends BaseRepository<RecipeType> {
    constructor(db: Firestore) {
        super(
            db,
            "recipeType",
            (code, data) => new RecipeType(new Code(code), data.recipeType),
            (recipeType) => ({
                recipeType: recipeType.getRecipeType(),
            })
        );
    }
}
