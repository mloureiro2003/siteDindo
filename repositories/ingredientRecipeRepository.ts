import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Ingredient } from "../models/ingredient.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { MeasuringUnit } from "../models/measuringUnit.js";

export class IngredientRepository {
    private db: Firestore;
    private collectionName = "ingredientRecipe";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<IngredientRecipe[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new IngredientRecipe(data.ingredient, data.measuringUnit, data.unit);
        })
    }

    async create(ingredient: Ingredient, measuringUnit: MeasuringUnit, unit: number): Promise<IngredientRecipe> {
        const ingredientRecipe = new IngredientRecipe(ingredient, measuringUnit, unit);
        const docRef = doc(this.db, this.collectionName, ingredient.getCode().toString());

        await setDoc(docRef, {
            ingredient, 
            measuringUnit, 
            unit
        });

        return ingredientRecipe;
    }

    async delete(target: IngredientRecipe): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getIngredient().getCode().toString());
        await deleteDoc(docRef);
    }
}