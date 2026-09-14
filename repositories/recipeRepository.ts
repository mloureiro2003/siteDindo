import { Firestore, collection, addDoc, getDocs } from "firebase/firestore";

export interface RecipeIngredientData {
    ingredientCode: string;
    unitCode: string;
    quantity: number;
}

export interface RecipeData {
    name: string;
    typeCode: string;
    ingredients: RecipeIngredientData[];
    steps: string;
}

// NOTE: this repository works with plain Firestore data rather than the full
// Recipe / IngredientRecipe / Code class graph. Fully hydrating those on read
// would require fetching each referenced Ingredient and MeasuringUnit doc
// individually - a good next step once the "list recipes" view is built, but
// not required to persist a new recipe.
export class RecipeRepository {
    private db: Firestore;
    private collectionName = "recipes";

    constructor(db: Firestore) {
        this.db = db;
    }

    async getAll(): Promise<(RecipeData & { id: string })[]> {
        const colRef = collection(this.db, this.collectionName);
        const snapshot = await getDocs(colRef);

        return snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...(docSnap.data() as RecipeData)
        }));
    }

    async create(data: RecipeData): Promise<string> {
        const docRef = await addDoc(collection(this.db, this.collectionName), {
            ...data,
            createdAt: new Date()
        });
        return docRef.id;
    }
}