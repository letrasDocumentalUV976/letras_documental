import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { AuthState } from "./slices/authSlice";
import { BooksState } from "./slices/booksSlice";
import { LoansState } from "./slices/loansSlice";
import { MoviesState } from "./slices/moviesSlice";
import { StudentsState } from "./slices/studentsSlice";
import { UsersState } from "./slices/usersSlice";

export interface V1RootState {
  booksV1: BooksState;
  moviesV1: MoviesState;
  studentsV1: StudentsState;
  loansV1: LoansState;
  usersV1: UsersState;
  authV1: AuthState;
}

export type V1Dispatch = ThunkDispatch<V1RootState, unknown, UnknownAction>;
