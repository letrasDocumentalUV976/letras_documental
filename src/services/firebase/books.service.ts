import { Book, BookInput } from "@/types";
import { BOOKS_COLLECTION } from "./collections";
import { hasActiveLoanForBook } from "./loans.service";
import {
  createDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

export const BOOK_LOANED_ERROR = "No se puede modificar un libro que está prestado";

// Los libros creados antes de existir isActive no tienen el campo: se consideran activos.
const isBookActive = (book: Book) => book.isActive !== false;

export const getBooks = async () =>
  (await getCollection<Book>(BOOKS_COLLECTION)).filter(isBookActive);

export const getBookById = async (id: string) => {
  const book = await getDocumentById<Book>(BOOKS_COLLECTION, id);
  return book && isBookActive(book) ? book : null;
};

export const createBook = (input: BookInput) =>
  createDocument<Book>(BOOKS_COLLECTION, { ...input, isActive: true });

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
  return updateDocument(BOOKS_COLLECTION, id, { isActive: false });
};
