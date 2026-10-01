import { Code } from "../models/code.js";
import { MeasuringUnit } from "../models/measuringUnit.js";
import { BaseRepository } from "./baseRepository.js";
export class MeasuringUnitRepository extends BaseRepository {
    constructor(db) {
        super(db, "measuringUnit", 
        // Documents saved before the flag existed have no field: they stay quantifiable.
        (code, data) => new MeasuringUnit(new Code(code), data.unit, data.quantifiable !== false), (unit) => ({
            unit: unit.getUnit(),
            quantifiable: unit.isQuantifiable(),
        }));
    }
}
//# sourceMappingURL=measuringUnitRepository.js.map