import { CreateInput, FirestoreId } from "./common";

export type MovieCopyType = "original" | "copy" | "bluray";

export type YesNo = "yes" | "no";

export interface Movie {
  id: FirestoreId;
  title: string;
  director: string;
  publicationYear: string;
  type: MovieCopyType;
  duration: string;
  genre: string;
  country: string;
  language: string;
  subtitles: YesNo;
  image: string;
}

export type MovieInput = CreateInput<Movie>;
