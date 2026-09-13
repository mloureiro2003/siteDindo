import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Code } from "../models/code.js";
import { Ingredient } from "../models/ingredient" 
import { FoodGroup } from "../models/foodGroup"

export class IngredientRepository {
    private db: Firestore;
    private collectionName = "ingredien";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<Ingredient[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new Ingredient(data.name, data.foodGroup, data.code, data.synonym);
        });
    }

    async create(name: string, foodGroup: FoodGroup, code: Code, synonym?: string): Promise<Ingredient>{
        const ingredient = new Ingredient(name, foodGroup, code, synonym);
        const docRef = doc(this.db, this.collectionName, code.toString());
        
        await setDoc(docRef, {
            name, 
            foodGroup, 
            code, 
            synonym
        });

        return ingredient;
    }

    async delete(ingredient: Ingredient[], target: Ingredient): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getCode().toString());
        await deleteDoc(docRef);
    }
}