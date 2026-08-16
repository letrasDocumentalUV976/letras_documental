import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book, BookInput } from "@/types";
import {
  createBookRequest,
  deleteBookRequest,
  fetchBooksRequest,
  updateBookRequest,
} from "../api/booksApi";
import { RequestStatus } from "../requestStatus";

export interface BooksState {
  items: Book[];
  status: RequestStatus;
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchBooks = createAsyncThunk<Book[]>(
  "booksV1/fetchAll",
  () => fetchBooksRequest()
);

export const createBook = createAsyncThunk<Book, BookInput>(
  "booksV1/create",
  (input) => createBookRequest(input)
);

export const updateBook = createAsyncThunk<
  { id: string; input: Partial<BookInput> },
  { id: string; input: Partial<BookInput> }
>("booksV1/update", async ({ id, input }) => {
  await updateBookRequest(id, input);
  return { id, input };
});

export const deleteBook = createAsyncThunk<string, string>(
  "booksV1/delete",
  async (id) => {
    await deleteBookRequest(id);
    return id;
  }
);

const booksSlice = createSlice({
  name: "booksV1",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch books";
      })
      .addCase(createBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.items.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const { id, input } = action.payload;
        const index = state.items.findIndex((book) => book.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...input };
        }
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((book) => book.id !== action.payload);
      });
  },
});

export default booksSlice.reducer;

export const selectBooks = (state: { booksV1: BooksState }) =>
  state.booksV1.items;
export const selectBooksStatus = (state: { booksV1: BooksState }) =>
  state.booksV1.status;
export const selectBooksError = (state: { booksV1: BooksState }) =>
  state.booksV1.error;
