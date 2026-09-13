import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Code } from "../models/code.js";
import { MeasuringUnit } from "../models/measuringUnit.js";

export class MeasuringUnitRepository {
    private db: Firestore;
    private collectionName = "measuringUnit";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<MeasuringUnit[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new MeasuringUnit(data.value, data.code);
        });
    }

    async create(value: string, code: Code): Promise<MeasuringUnit> {
        const measuringUnit = new MeasuringUnit(value, code);
        const docRef = doc(this.db, this.collectionName, code.toString());

        await setDoc(docRef, {
            value, 
            code
        });

        return measuringUnit
    }

    async delete(target: MeasuringUnit): Promise<void> {
        const docref = doc(this.db, this.collectionName, target.getCode().toString());
        await deleteDoc(docref);
    }
}