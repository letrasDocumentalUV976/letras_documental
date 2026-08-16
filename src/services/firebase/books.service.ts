import { Book, BookInput } from "@/types";
import { BOOKS_COLLECTION } from "./collections";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

export const getBooks = () => getCollection<Book>(BOOKS_COLLECTION);

export const getBookById = (id: string) =>
  getDocumentById<Book>(BOOKS_COLLECTION, id);

export const createBook = (input: BookInput) =>
  createDocument<Book>(BOOKS_COLLECTION, input);

export const updateBook = (id: string, input: Partial<BookInput>) =>
  updateDocument(BOOKS_COLLECTION, id, input);

export const deleteBook = (id: string) => deleteDocument(BOOKS_COLLECTION, id);
