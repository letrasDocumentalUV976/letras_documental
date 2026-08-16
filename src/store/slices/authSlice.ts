import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PublicUser } from "@/types";
import { loginRequest } from "../api/authApi";
import { RequestStatus } from "../requestStatus";

export interface AuthState {
  user: PublicUser | null;
  status: RequestStatus;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  PublicUser,
  { email: string; password: string }
>("authV1/login", ({ email, password }) => loginRequest(email, password));

const authSlice = createSlice({
  name: "authV1",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    setSessionUser: (state, action: PayloadAction<PublicUser | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<PublicUser>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to authenticate user";
      });
  },
});

export const { logout, setSessionUser } = authSlice.actions;
export default authSlice.reducer;

export const selectSessionUser = (state: { authV1: AuthState }) =>
  state.authV1.user;
export const selectAuthStatus = (state: { authV1: AuthState }) =>
  state.authV1.status;
export const selectAuthError = (state: { authV1: AuthState }) =>
  state.authV1.error;
