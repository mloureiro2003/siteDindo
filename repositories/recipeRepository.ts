import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";import { Code } from "../models/code.js";
import { RecipeType } from "../models/recipeType.js";
import { IngredientRecipe } from "../models/ingredientRecipe.js";
import { Recipe } from "../models/recipe.js";

export class RecipeRepository {
    private db: Firestore;
    private collectionName = "recipe";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<Recipe[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return new Recipe(data.name, data.code, data.recipeType, data.ingredients, data.steps);
        })
    }

    async create(name: string, code: Code, recipeType: RecipeType, ingredients: IngredientRecipe[], steps: string[]): Promise<Recipe> {
        const recipe = new Recipe(name, code, recipeType, ingredients, steps);
        const docRef = doc(this.db, this.collectionName, code.toString());

        await setDoc(docRef, {
            name, 
            code, 
            recipeType, 
            ingredients, 
            steps,
        });

        return recipe;
    }

    async delete(target: Recipe): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getCode().toString());
        await deleteDoc(docRef);
    }
}