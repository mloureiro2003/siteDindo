import { Firestore, collection, getDocs, doc, setDoc, deleteDoc, CollectionReference } from "firebase/firestore";

export abstract class BaseRepository<T> {
    protected collectionRef: CollectionReference;

    constructor(
        protected db: Firestore,
        protected collectionName: string
    ) {
        this.collectionRef = collection(this.db, this.collectionName);
    }

    async getAll(): Promise<T[]> {
        const snapshot = await getDocs(this.collectionRef);
        return snapshot.docs.map((docSnap) => this.mapToDomain(docSnap.id, docSnap.data()));
    }

    async delete(item: T): Promise<void> {
        const id = this.getId(item);
        const docRef = doc(this.db, this.collectionName, id);
        await deleteDoc(docRef);
    }

    async save(item: T): Promise<void> {
        const id = this.getId(item);
        const docRef = doc(this.db, this.collectionName, id);
        const data = this.mapToDatabase(item);
        await setDoc(docRef, data, { merge: true });
    }

    protected abstract getId(item: T): string;
    protected abstract mapToDomain(id: string, data: any): T;
    protected abstract mapToDatabase(item: T): any;
}