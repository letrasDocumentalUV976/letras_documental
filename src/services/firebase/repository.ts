import type { DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "./admin";

export const getCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  const snapshot = await getAdminFirestore().collection(collectionName).get();
  return snapshot.docs.map(
    (document) => ({ id: document.id, ...document.data() } as T)
  );
};

export const getDocumentById = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const documentSnapshot = await getAdminFirestore()
    .collection(collectionName)
    .doc(id)
    .get();
  if (!documentSnapshot.exists) return null;
  return { id: documentSnapshot.id, ...documentSnapshot.data() } as T;
};

export const createDocument = async <T>(
  collectionName: string,
  data: DocumentData
): Promise<T> => {
  const documentReference = await getAdminFirestore()
    .collection(collectionName)
    .add(data);
  const createdDocument = { ...data, id: documentReference.id };
  await documentReference.update({ id: documentReference.id });
  return createdDocument as T;
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<void> => {
  await getAdminFirestore().collection(collectionName).doc(id).update(data);
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  await getAdminFirestore().collection(collectionName).doc(id).delete();
};
