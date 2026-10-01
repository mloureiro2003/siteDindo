import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";
import { BaseRepository } from "./baseRepository.js";
export class FoodGroupRepository extends BaseRepository {
    constructor(db) {
        super(db, "foodGroup", (code, data) => new FoodGroup(new Code(code), data.foodGroup), (foodGroup) => ({
            foodGroup: foodGroup.getFoodGroup(),
        }));
    }
}
//# sourceMappingURL=foodGroupRepository.js.map