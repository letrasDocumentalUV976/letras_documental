import type { DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "./admin";

export const getCollection = async <T>(
  collectionName: string
): Promise<T[]> => {
  try {
    const snapshot = await getAdminFirestore()
      .collection(collectionName)
      .get();
    return snapshot.docs.map(
      (document) => ({ id: document.id, ...document.data() } as T)
    );
  } catch (error) {
    console.error(`getCollection(${collectionName}) failed:`, error);
    throw error;
  }
};

export const getDocumentById = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  try {
    const documentSnapshot = await getAdminFirestore()
      .collection(collectionName)
      .doc(id)
      .get();
    if (!documentSnapshot.exists) return null;
    return { id: documentSnapshot.id, ...documentSnapshot.data() } as T;
  } catch (error) {
    console.error(`getDocumentById(${collectionName}, ${id}) failed:`, error);
    throw error;
  }
};

export const createDocument = async <T>(
  collectionName: string,
  data: DocumentData
): Promise<T> => {
  try {
    const documentReference = await getAdminFirestore()
      .collection(collectionName)
      .add(data);
    const createdDocument = { ...data, id: documentReference.id };
    await documentReference.update({ id: documentReference.id });
    return createdDocument as T;
  } catch (error) {
    console.error(`createDocument(${collectionName}) failed:`, error);
    throw error;
  }
};

export const setDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<void> => {
  try {
    await getAdminFirestore().collection(collectionName).doc(id).set(data);
  } catch (error) {
    console.error(`setDocument(${collectionName}, ${id}) failed:`, error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: DocumentData
): Promise<void> => {
  try {
    await getAdminFirestore().collection(collectionName).doc(id).update(data);
  } catch (error) {
    console.error(`updateDocument(${collectionName}, ${id}) failed:`, error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  try {
    await getAdminFirestore().collection(collectionName).doc(id).delete();
  } catch (error) {
    console.error(`deleteDocument(${collectionName}, ${id}) failed:`, error);
    throw error;
  }
};
