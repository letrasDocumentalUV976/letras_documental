import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie, MovieInput } from "@/types";
import {
  createMovieRequest,
  deleteMovieRequest,
  fetchMoviesRequest,
  updateMovieRequest,
} from "../api/moviesApi";
import { RequestStatus } from "../requestStatus";

export interface MoviesState {
  items: Movie[];
  status: RequestStatus;
  error: string | null;
}

const initialState: MoviesState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchMovies = createAsyncThunk<Movie[]>(
  "moviesV1/fetchAll",
  () => fetchMoviesRequest()
);

export const createMovie = createAsyncThunk<Movie, MovieInput>(
  "moviesV1/create",
  (input) => createMovieRequest(input)
);

export const updateMovie = createAsyncThunk<
  { id: string; input: Partial<MovieInput> },
  { id: string; input: Partial<MovieInput> }
>("moviesV1/update", async ({ id, input }) => {
  await updateMovieRequest(id, input);
  return { id, input };
});

export const deleteMovie = createAsyncThunk<string, string>(
  "moviesV1/delete",
  async (id) => {
    await deleteMovieRequest(id);
    return id;
  }
);

const moviesSlice = createSlice({
  name: "moviesV1",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch movies";
      })
      .addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.items.push(action.payload);
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const { id, input } = action.payload;
        const index = state.items.findIndex((movie) => movie.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...input };
        }
      })
      .addCase(
        deleteMovie.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (movie) => movie.id !== action.payload
          );
        }
      );
  },
});

export default moviesSlice.reducer;

export const selectMovies = (state: { moviesV1: MoviesState }) =>
  state.moviesV1.items;
export const selectMoviesStatus = (state: { moviesV1: MoviesState }) =>
  state.moviesV1.status;
export const selectMoviesError = (state: { moviesV1: MoviesState }) =>
  state.moviesV1.error;
