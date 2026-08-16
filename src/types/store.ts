import { Book } from "./book";
import { Loan } from "./loan";
import { Movie } from "./movie";
import { SessionUser } from "./user";

export interface AppState {
  books: Book[];
  movies: Movie[];
  loans: Loan[];
  user: SessionUser | null;
}
