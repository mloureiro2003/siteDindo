import { Firestore } from "firebase/firestore";
import { Code } from "../models/code.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { BaseRepository } from "./baseRepository.js";

export class MeasuringUnitRepository extends BaseRepository<MeasuringUnit> {
    constructor(db: Firestore) {
        super(db, "measuringUnit");
    }

    protected getId(item: MeasuringUnit): string {
        return item.getCode().getValue();
    }

    protected mapToDomain(id: string, data: any): MeasuringUnit {
        return new MeasuringUnit(new Code(id), data.value);
    }

    protected mapToDatabase(item: MeasuringUnit): any {
        return {
            code: item.getCode().getValue(),
            value: item.getValue()
        };
    }
}