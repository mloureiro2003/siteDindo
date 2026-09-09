import { File } from "../services/file.js";
import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType"

export class RecipeTypeRepository {
    private static FILE_PATH = "recipeType.json";

    getAll(): RecipeType[]{
        const rawData: { value: string, code: Code}[] = File.getFileContent(RecipeTypeRepository.FILE_PATH)
        return rawData.map(item => new RecipeType(item.value, item.code));
    }
    
    create(value: string, code: Code): RecipeType{
        return new RecipeType(value, code);
    }

    delete(recipetype: RecipeType[], target: RecipeType): RecipeType[] {
        return recipetype.filter(recipetype => recipetype.getCode() !== target.getCode());
    }
}