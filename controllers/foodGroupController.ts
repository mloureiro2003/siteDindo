import { FoodGroupRepository } from "../repositories/foodGroupRepository";
import { FoodGroup } from "../models/foodGroup";
import { Code } from "firebase/data-connect";
import { TableRenderer } from "../components/tableRenderer";

export class FoodGroupController {
    private reposiroty: FoodGroupRepository;
    private tableRenderer: TableRenderer<MeasuringUnit> | null = null;
    private editingUnit: MeasuringUnit | null = null;
    private form: HTMLFormElement | null = null;
    private codeInput: HTMLInputElement | null = null;
    private descriptionInput: HTMLInputElement | null = null;
    private submitButton: HTMLButtonElement | null = null;
}