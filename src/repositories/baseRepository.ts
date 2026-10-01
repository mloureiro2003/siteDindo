import {
    Firestore, CollectionReference,
    collection, getDocs, getDoc, doc, setDoc, deleteDoc
} from "firebase/firestore";
import type { Code } from "../models/code.js";

export interface HasCode {
    getCode(): Code;
}

export class BaseRepository<T extends HasCode> {
    protected collectionRef: CollectionReference;

    constructor(
        protected db: Firestore,
        protected collectionName: string,
        private mapToDomain: (id: string, data: any, context: any) => T,
        private mapToDatabase: (item: T) => any,
        private loadContext: () => Promise<any> = async () => undefined
    ) {
        this.collectionRef = collection(this.db, this.collectionName);
    }

    protected getCode(item: T): string {
        return item.getCode().getCode();
    }

    async getAll(): Promise<T[]> {
        const context = await this.loadContext();
        const snapshot = await getDocs(this.collectionRef);
        return snapshot.docs.map((docSnap) => this.mapToDomain(docSnap.id, docSnap.data(), context));
    }

    async delete(item: T): Promise<void> {
        const docRef = doc(this.db, this.collectionName, this.getCode(item));
        await deleteDoc(docRef);
    }

    /**
     * Creates or updates an item.
     * - Creating with a code that already exists is rejected (it used to overwrite silently).
     * - If the code changed while editing, the old document is removed AFTER the new one is saved.
     */
    async update(previous: T | null, updated: T): Promise<void> {
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

    async save(item: T): Promise<void> {
        const code = this.getCode(item);
        this.assertValidCode(code);

        const docRef = doc(this.db, this.collectionName, code);
        const data = { code, ...this.mapToDatabase(item) };
        await setDoc(docRef, data, { merge: true });
    }

    private async exists(code: string): Promise<boolean> {
        const snapshot = await getDoc(doc(this.db, this.collectionName, code));
        return snapshot.exists();
    }

    // Firestore document ids cannot be empty, contain "/" or be "." / "..".
    private assertValidCode(code: string): void {
        if (!code || code === "." || code === ".." || code.includes("/")) {
            throw new Error(`Código inválido: "${code}". Não use campo vazio, "/", "." ou "..".`);
        }
    }
}
