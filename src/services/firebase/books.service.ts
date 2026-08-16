import { Book, BookInput } from "@/types";
import { BOOKS_COLLECTION } from "./collections";
import { hasActiveLoanForBook } from "./loans.service";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

export const BOOK_LOANED_ERROR = "No se puede modificar un libro que está prestado";

export const getBooks = () => getCollection<Book>(BOOKS_COLLECTION);

export const getBookById = (id: string) =>
  getDocumentById<Book>(BOOKS_COLLECTION, id);

export const createBook = (input: BookInput) =>
  createDocument<Book>(BOOKS_COLLECTION, input);

export const updateBook = async (id: string, input: Partial<BookInput>) => {
  if (await hasActiveLoanForBook(id)) {
    throw new Error(BOOK_LOANED_ERROR);
  }
  return updateDocument(BOOKS_COLLECTION, id, input);
};

export const deleteBook = async (id: string) => {
  if (await hasActiveLoanForBook(id)) {
    throw new Error(BOOK_LOANED_ERROR);
  }
  return deleteDocument(BOOKS_COLLECTION, id);
};
