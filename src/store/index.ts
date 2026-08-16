import authReducer from "./slices/authSlice";
import booksReducer from "./slices/booksSlice";
import loansReducer from "./slices/loansSlice";
import moviesReducer from "./slices/moviesSlice";
import studentsReducer from "./slices/studentsSlice";
import usersReducer from "./slices/usersSlice";

export const v1Reducers = {
  booksV1: booksReducer,
  moviesV1: moviesReducer,
  studentsV1: studentsReducer,
  loansV1: loansReducer,
  usersV1: usersReducer,
  authV1: authReducer,
};

export * from "./hooks";
export * from "./types";
export * from "./slices/authSlice";
export * from "./slices/booksSlice";
export * from "./slices/loansSlice";
export * from "./slices/moviesSlice";
export * from "./slices/studentsSlice";
export * from "./slices/usersSlice";
export * from "./api/invitationsApi";
