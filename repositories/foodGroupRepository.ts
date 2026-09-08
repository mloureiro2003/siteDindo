import { File } from "@services/file";
import { Code } from "@models/code";
import { FoodGroup } from "@models/foodGroup"

export class FoodGroupRepository {
    private static FILE_PATH = "foodGroup.json";

    getAll(): FoodGroup[] {
        const rawData: { value: string, code: Code}[] = File.getFileContent(FoodGroupRepository.FILE_PATH)
        return rawData.map(item => new FoodGroup(item.value, item.code));
    }

    create(value: string, code: Code): FoodGroup{
        return new FoodGroup(value, code);
    }

    delete(foodGroup: FoodGroup[], target: FoodGroup): FoodGroup[] {
        return foodGroup.filter(foodGroup => foodGroup.getCode() !== target.getCode());
    }
}