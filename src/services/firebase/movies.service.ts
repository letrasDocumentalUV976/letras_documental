import { Movie, MovieInput } from "@/types";
import { MOVIES_COLLECTION } from "./collections";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

export const getMovies = () => getCollection<Movie>(MOVIES_COLLECTION);

export const getMovieById = (id: string) =>
  getDocumentById<Movie>(MOVIES_COLLECTION, id);

export const createMovie = (input: MovieInput) =>
  createDocument<Movie>(MOVIES_COLLECTION, input);

export const updateMovie = (id: string, input: Partial<MovieInput>) =>
  updateDocument(MOVIES_COLLECTION, id, input);

export const deleteMovie = (id: string) =>
  deleteDocument(MOVIES_COLLECTION, id);
