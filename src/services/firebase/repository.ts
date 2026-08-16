import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./app";

export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const snapshot = await getDocs(collection(firestore, collectionName));
  return snapshot.docs.map(
    (document) => ({ id: document.id, ...document.data() } as T)
  );
};

export const getDocumentById = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const documentSnapshot = await getDoc(doc(firestore, collectionName, id));
  if (!documentSnapshot.exists()) return null;
  return { id: documentSnapshot.id, ...documentSnapshot.data() } as T;
};

export const createDocument = async <T>(
  collectionName: string,
  data: DocumentData
): Promise<T> => {
  const documentReference = await addDoc(
    collection(firestore, collectionName),
    data
  );
  const createdDocument = { ...data, id: documentReference.id };
  await updateDoc(documentReference, { id: documentReference.id });
  return createdDocument as T;
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<void> => {
  await updateDoc(doc(firestore, collectionName, id), data);
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  await deleteDoc(doc(firestore, collectionName, id));
};
