import { Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Code } from "../models/code.js";
import { FoodGroup } from "../models/foodGroup.js";
import { Ingredient } from "../models/ingredient.js";

export class IngredientRepository {
    private db: Firestore;
    private collectionName = "ingredients";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<Ingredient[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const foodGroup = new FoodGroup(data.groupValue ?? "", new Code(data.groupCode));
            return new Ingredient(data.name, foodGroup, new Code(data.code), data.synonym);
        });
    }

    async create(
        name: string,
        code: Code,
        foodGroup: FoodGroup,
        synonym?: string,
        specifications?: string
    ): Promise<Ingredient> {
        const ingredient = new Ingredient(name, foodGroup, code, synonym);
        const docRef = doc(this.db, this.collectionName, code.getValue());

        await setDoc(docRef, {
            name,
            code: code.getValue(),
            groupCode: foodGroup.getCode().getValue(),
            groupValue: foodGroup.getValue(),
            synonym: synonym ?? "",
            specifications: specifications ?? "",
            createdAt: new Date()
        });

        return ingredient;
    }

    async delete(target: Ingredient): Promise<void> {
        const docRef = doc(this.db, this.collectionName, target.getCode().getValue());
        await deleteDoc(docRef);
    }
}