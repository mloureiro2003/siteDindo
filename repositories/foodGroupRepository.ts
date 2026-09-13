import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";

export class FoodGroupRepository {
    private db: Firestore;
    private collectionName = "foodGroup";
    
    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<FoodGroup[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new FoodGroup(data.value, data.code);
        });
    }

    async create(value: string, code: Code): Promise<FoodGroup> {
        const foodGroup = new FoodGroup(value, code);
        const docRef = doc(this.db, this.collectionName, code.toString());
        
        await setDoc(docRef, {
            value,
            code
        });
        
        return foodGroup;
    }

    async delete(target: FoodGroup): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getCode().toString());
        await deleteDoc(docRef);
    }
}