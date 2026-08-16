import { CreateInput, FirestoreId } from "./common";

export type Shelf = "1" | "2";

export interface BookLocation {
  column?: number;
  row?: number;
  shelf: Shelf;
}

export interface Book {
  id: FirestoreId;
  title: string;
  author: string;
  publisher: string;
  publicationYear: string;
  pageCount: string;
  type: string;
  description: string;
  image: string;
  quantity?: number;
  location: BookLocation;
}

export type BookInput = CreateInput<Book>;
