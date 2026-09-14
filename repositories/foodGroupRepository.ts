import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";
import { BaseRepository } from "./baseRepository.js";

export class FoodGroupRepository  extends BaseRepository<FoodGroup> {
    constructor(db: Firestore) {
        super(db, "foodGroup");
    }

    protected getId(item: FoodGroup): string {
        return item.getCode().getValue();
    }

    protected mapToDomain(id: string, data: any): FoodGroup {
        return new FoodGroup(new Code(id), data.description);
    }

    protected mapToDatabase(item: FoodGroup): any {
        return {
            code: item.getCode().getValue(),
            description: item.getValue()   
        }
    }
}