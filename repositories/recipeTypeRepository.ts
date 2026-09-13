import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType"
import { FoodGroup } from "../models/foodGroup.js";

export class RecipeTypeRepository {
    private db: Firestore;
    private collectionName = "foodGroup";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<RecipeType[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new RecipeType(data.value, data.code);
        });
    }
    
    async create(value: string, code: Code): Promise<RecipeType>{
        const recipeType = new RecipeType(value, code);
        const docRef = doc(this.db, this.collectionName, code.toString());
    
        await setDoc(docRef, {
            value, 
            code
        })

        return recipeType;
    }

    async delete(target: RecipeType): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getCode().toString());
        await deleteDoc(docRef);
    }
}