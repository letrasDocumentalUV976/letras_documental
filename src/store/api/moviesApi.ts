import { Movie, MovieInput } from "@/types";
import { requestJson } from "./httpClient";

const MOVIES_ENDPOINT = "/api/movies";

export const fetchMoviesRequest = () => requestJson<Movie[]>(MOVIES_ENDPOINT);

export const createMovieRequest = (input: MovieInput) =>
  requestJson<Movie>(MOVIES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateMovieRequest = (id: string, input: Partial<MovieInput>) =>
  requestJson<null>(`${MOVIES_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteMovieRequest = (id: string) =>
  requestJson<null>(`${MOVIES_ENDPOINT}/${id}`, { method: "DELETE" });
