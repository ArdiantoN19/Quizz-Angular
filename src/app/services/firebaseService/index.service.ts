import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  query,
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
   * @param collectionName
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
   * @param input
   * @param collectionName
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
   * @param  collectionName
   * @param  docId
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
   * @param collectionName
   * @param query you must type object same as TQueryExpression
   *
   * @returns Observable data with type generic
   */
  getCollectionDataWithObservableByQuery<T>(
    collectionName: string,
    queryExpression: TQueryExpression
  ): Observable<T[]> {
    const collectionReference = collection(this.firestore, collectionName);

    const { fieldName, condition, value } = queryExpression;
    const compositeFilter = where(fieldName, condition, value);

    const queryCollectionData = query(collectionReference, compositeFilter);
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

  async getDocumentByDocId<T>(
    collectionName: string,
    docId: string
  ): Promise<T> {
    const collectionReference = doc(this.firestore, collectionName, docId);
    const docSnapshot: DocumentSnapshot<DocumentData> = await getDoc(
      collectionReference
    );
    if (!docSnapshot.exists()) {
      throw new Error(
        'Failed when get document, please check your document Id'
      );
    }

    return { id: docSnapshot.id, ...docSnapshot.data() } as T;
  }

  async getDocumentByQuery<T>(
    collectionName: string,
    queryExpression: TQueryExpression
  ): Promise<T[]> {
    try {
      const collectionReference = collection(this.firestore, collectionName);
      const { fieldName, condition, value } = queryExpression;

      const compositeFilter = where(fieldName, condition, value);
      const queryCollectionData = query(collectionReference, compositeFilter);

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
}
