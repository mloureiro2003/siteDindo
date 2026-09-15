import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType.js"
import { BaseRepository } from "./baseRepository.js";

export class RecipeTypeRepository extends BaseRepository<RecipeType> {
    constructor(db: Firestore) {
        super (db, "recipeType")
    }

    protected getId(item: RecipeType): string {
        return item.getCode().getCode();
    }

    protected mapToDomain(id: string, data: any): RecipeType {
        return new RecipeType(new Code(id), data.recipeType);
    }

    protected mapToDatabase(item: RecipeType) {
        return {
            code: item.getCode().getCode(),
            recipeType: item.getRecipeType()
        };
    }
}