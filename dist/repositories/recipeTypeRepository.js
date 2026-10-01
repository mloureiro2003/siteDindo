import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType.js";
import { BaseRepository } from "./baseRepository.js";
export class RecipeTypeRepository extends BaseRepository {
    constructor(db) {
        super(db, "recipeType", (code, data) => new RecipeType(new Code(code), data.recipeType), (recipeType) => ({
            recipeType: recipeType.getRecipeType(),
        }));
    }
}
//# sourceMappingURL=recipeTypeRepository.js.map