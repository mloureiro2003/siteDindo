import { BaseController } from "./baseController";
import { FoodGroupRepository } from "../repositories/foodGroupRepository";
import { FoodGroup } from "../models/foodGroup";
import { Code } from "firebase/data-connect";

export class FoodGroupController extends BaseController<FoodGroup> {
    private codeInput = HTMLInputElement | null = null;
    private valueInput = HTMLInputElement | null = null;

    constructor(private repository: FoodGroupRepository) {
        super("food")
    }
}