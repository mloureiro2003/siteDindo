import { File } from "../services/file.js";
import { Code } from "../models/code.js";
import { MeasuringUnit } from "../models/measuringUnit.js";

export class MeasuringUnitRepository {
    private static FILE_PATH = "measuringUnit.json";

    getAll(): MeasuringUnit[] {
        const rawData: { value: string, code: Code }[] = File.getFileContent(MeasuringUnitRepository.FILE_PATH);
        return rawData.map(item => new MeasuringUnit(item.value, item.code));
    }

    create(value: string, code: Code): MeasuringUnit {
        return new MeasuringUnit(value, code);
    }

    delete(measuringUnits: MeasuringUnit[], target: MeasuringUnit): MeasuringUnit[] {
        return measuringUnits.filter(measuringUnit => measuringUnit.getCode() !== target.getCode());
    }
}