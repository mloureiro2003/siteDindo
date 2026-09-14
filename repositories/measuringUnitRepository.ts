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

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return new MeasuringUnit(data.value, new Code(data.code));
        });
    }

    async create(value: string, code: Code): Promise<MeasuringUnit> {
        const measuringUnit = new MeasuringUnit(value, code);
        const docRef = doc(this.db, this.collectionName, code.getValue());

        await setDoc(docRef, {
            value,
            code: code.getValue(),
            createdAt: new Date()
        });

        return measuringUnit;
    }

    async delete(target: MeasuringUnit): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getCode().getValue());
        await deleteDoc(docRef);
    }
}