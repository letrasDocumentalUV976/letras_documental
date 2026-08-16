import { Book, BookInput } from "@/types";
import { requestJson } from "./httpClient";

const BOOKS_ENDPOINT = "/api/books";

export const fetchBooksRequest = () => requestJson<Book[]>(BOOKS_ENDPOINT);

export const createBookRequest = (input: BookInput) =>
  requestJson<Book>(BOOKS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateBookRequest = (id: string, input: Partial<BookInput>) =>
  requestJson<null>(`${BOOKS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteBookRequest = (id: string) =>
  requestJson<null>(`${BOOKS_ENDPOINT}/${id}`, { method: "DELETE" });
