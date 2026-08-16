import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicUser, UserInput } from "@/types";
import {
  createUserRequest,
  deleteUserRequest,
  fetchUsersRequest,
  updateUserRequest,
} from "../api/usersApi";
import { RequestStatus } from "../requestStatus";

export interface UsersState {
  items: PublicUser[];
  status: RequestStatus;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk<PublicUser[]>(
  "usersV1/fetchAll",
  () => fetchUsersRequest()
);

export const createUser = createAsyncThunk<PublicUser, UserInput>(
  "usersV1/create",
  (input) => createUserRequest(input)
);

export const updateUser = createAsyncThunk<
  { id: string; input: Partial<UserInput> },
  { id: string; input: Partial<UserInput> }
>("usersV1/update", async ({ id, input }) => {
  await updateUserRequest(id, input);
  return { id, input };
});

export const deleteUser = createAsyncThunk<string, string>(
  "usersV1/delete",
  async (id) => {
    await deleteUserRequest(id);
    return id;
  }
);

const usersSlice = createSlice({
  name: "usersV1",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<PublicUser[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch users";
      })
      .addCase(
        createUser.fulfilled,
        (state, action: PayloadAction<PublicUser>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, input } = action.payload;
        const index = state.items.findIndex((user) => user.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...input };
        }
      })
      .addCase(
        deleteUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (user) => user.id !== action.payload
          );
        }
      );
  },
});

export default usersSlice.reducer;

export const selectUsers = (state: { usersV1: UsersState }) =>
  state.usersV1.items;
export const selectUsersStatus = (state: { usersV1: UsersState }) =>
  state.usersV1.status;
export const selectUsersError = (state: { usersV1: UsersState }) =>
  state.usersV1.error;
