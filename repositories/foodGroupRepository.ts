import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";
import { BaseRepository } from "./baseRepository.js";

export class FoodGroupRepository  extends BaseRepository<FoodGroup> {
    constructor(db: Firestore) {
        super(db, "foodGroup");
    }

    protected getId(foodGroup: FoodGroup): string {
        return foodGroup.getCode().getCode();
    }

    protected mapToDomain(code: string, data: any): FoodGroup {
        return new FoodGroup(new Code(code), data.foodGroup);
    }

    protected mapToDatabase(foodGroup: FoodGroup): any {
        return {
            code: foodGroup.getCode().getCode(),
            foodGroup: foodGroup.getFoodGroup()   
        }
    }
}