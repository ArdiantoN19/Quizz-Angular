import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  query,
  QueryFieldFilterConstraint,
  QuerySnapshot,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TQueryExpression } from './index.type';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  /**
   * This function to get many data or documents from collection reference by collection name
   * @param collectionName Name of your collection that you want get
   *
   * @returns Observable data with type generic
   *
   */
  getCollectionDataWithObservable<T>(collectionName: string): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName);
    return collectionData(collectionReference) as Observable<T[]>;
  }

  /**
   * This function for add new document to collection
   * @param input Data or payload for new document
   * @param collectionName Name of your collection that you want get
   * @returns Object with key is string same like what you input
   */
  async addDocument<T extends DocumentData>(
    input: T,
    collectionName: string
  ): Promise<T & { id: string }> {
    const collectionReference = collection(this.firestore, collectionName);
    const newDocRef: DocumentReference<DocumentData> = await addDoc(
      collectionReference,
      input
    );

    const docSnapshot: DocumentSnapshot<DocumentData> = await getDoc(newDocRef);

    if (!docSnapshot.exists()) {
      throw new Error(
        `Error when adding document for collection ${collectionName}`
      );
    }

    return { id: docSnapshot.id, ...docSnapshot.data() } as T & { id: string };
  }

  /**
   * This function to get document reference by doc Id
   * @param  collectionName Name of your collection that you want get
   * @param  docId Document Id of your document
   * @returns Observable data with type generic
   */
  getCollectionDataWithObservableByDocId<T>(
    collectionName: string,
    docId: string
  ): Observable<T[]> {
    const collectionReference = collection(
      this.firestore,
      collectionName,
      docId
    );
    return collectionData(collectionReference) as Observable<T[]>;
  }

  /**
   * This function to get document with query expression
   * @param collectionName Name of your collection that you want get
   * @param queryExpression Must type object same as TQueryExpression
   *
   * @returns Observable data with type generic
   */
  getCollectionDataWithObservableByQuery<T>(
    collectionName: string,
    queryExpression: TQueryExpression[]
  ): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName);

    const compositeFilters: QueryFieldFilterConstraint[] = queryExpression.map(({fieldName, condition, value}) => where(fieldName, condition, value))

    const queryCollectionData = query(collectionReference, ...compositeFilters);
    return new Observable((observer) => {
      getDocs(queryCollectionData)
        .then((querySnapshot) => {
          const result = querySnapshot.docs.map(
            (doc: DocumentSnapshot<DocumentData>) => {
              const data = doc.data() as T;
              return { id: doc.id, ...data };
            }
          );

          observer.next(result);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  /**
   * 
   * @param collectionName Name of your collection that you want get
   * @param docId Document Id of your document
   * @returns The document that have match with doc id
   */
  async getDocumentByDocId<T>(
    collectionName: string,
    docId: string
  ): Promise<T> {
    const docRef = doc(this.firestore, collectionName, docId);
    const docSnapshot: DocumentSnapshot<DocumentData> = await getDoc(
      docRef
    );
    if (!docSnapshot.exists()) {
      throw new Error(
        'Failed when get document, please check your document Id'
      );
    }

    return { id: docSnapshot.id, ...docSnapshot.data() } as T;
  }

  /**
   * 
   * @param collectionName Name of your collection that you want get
   * @param queryExpression Must type object same as TQueryExpression
   * @returns The documents that have match with queryExpression condition
   */
  async getDocumentByQuery<T>(
    collectionName: string,
    queryExpression: TQueryExpression[]
  ): Promise<T[]> {
    try {
      const collectionReference = collection(this.firestore, collectionName);
      const compositeFilters: QueryFieldFilterConstraint[] = queryExpression.map(({fieldName, condition, value}) => where(fieldName, condition, value))

      const queryCollectionData = query(collectionReference, ...compositeFilters);

      const docSnapshot: QuerySnapshot = await getDocs(queryCollectionData);
      const result = docSnapshot.docs.map(
        (doc: DocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return { id: doc.id, ...data } as T;
        }
      );

      return result;
    } catch (error) {
      return [];
    }
  }

  /**
   * 
   * @param collectionName Name of your collection that you want get
   * @param docId Document Id of your document
   * @returns void
   */
  async deleteDocumentByDocId(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    return deleteDoc(docRef)
  }
}
