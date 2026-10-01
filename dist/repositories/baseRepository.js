import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
export class BaseRepository {
    db;
    collectionName;
    mapToDomain;
    mapToDatabase;
    loadContext;
    collectionRef;
    constructor(db, collectionName, mapToDomain, mapToDatabase, loadContext = async () => undefined) {
        this.db = db;
        this.collectionName = collectionName;
        this.mapToDomain = mapToDomain;
        this.mapToDatabase = mapToDatabase;
        this.loadContext = loadContext;
        this.collectionRef = collection(this.db, this.collectionName);
    }
    getCode(item) {
        return item.getCode().getCode();
    }
    async getAll() {
        const context = await this.loadContext();
        const snapshot = await getDocs(this.collectionRef);
        return snapshot.docs.map((docSnap) => this.mapToDomain(docSnap.id, docSnap.data(), context));
    }
    async delete(item) {
        const docRef = doc(this.db, this.collectionName, this.getCode(item));
        await deleteDoc(docRef);
    }
    /**
     * Creates or updates an item.
     * - Creating with a code that already exists is rejected (it used to overwrite silently).
     * - If the code changed while editing, the old document is removed AFTER the new one is saved.
     */
    async update(previous, updated) {
        const newCode = this.getCode(updated);
        this.assertValidCode(newCode);
        const previousCode = previous ? this.getCode(previous) : null;
        if (previousCode !== newCode && (await this.exists(newCode))) {
            throw new Error(`Já existe um registro com o código "${newCode}".`);
        }
        await this.save(updated);
        if (previous && previousCode !== newCode) {
            await this.delete(previous);
        }
    }
    async save(item) {
        const code = this.getCode(item);
        this.assertValidCode(code);
        const docRef = doc(this.db, this.collectionName, code);
        const data = { code, ...this.mapToDatabase(item) };
        await setDoc(docRef, data, { merge: true });
    }
    async exists(code) {
        const snapshot = await getDoc(doc(this.db, this.collectionName, code));
        return snapshot.exists();
    }
    // Firestore document ids cannot be empty, contain "/" or be "." / "..".
    assertValidCode(code) {
        if (!code || code === "." || code === ".." || code.includes("/")) {
            throw new Error(`Código inválido: "${code}". Não use campo vazio, "/", "." ou "..".`);
        }
    }
}
//# sourceMappingURL=baseRepository.js.map