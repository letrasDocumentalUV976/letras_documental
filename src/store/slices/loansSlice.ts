import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Loan, LoanInput } from "@/types";
import {
  createLoanRequest,
  deleteLoanRequest,
  fetchLoansRequest,
  updateLoanRequest,
} from "../api/loansApi";
import { RequestStatus } from "../requestStatus";

export interface LoansState {
  items: Loan[];
  status: RequestStatus;
  error: string | null;
}

const initialState: LoansState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchLoans = createAsyncThunk<Loan[]>(
  "loansV1/fetchAll",
  () => fetchLoansRequest()
);

export const createLoan = createAsyncThunk<Loan, LoanInput>(
  "loansV1/create",
  (input) => createLoanRequest(input)
);

export const updateLoan = createAsyncThunk<
  { id: string; input: Partial<LoanInput> },
  { id: string; input: Partial<LoanInput> }
>("loansV1/update", async ({ id, input }) => {
  await updateLoanRequest(id, input);
  return { id, input };
});

export const deleteLoan = createAsyncThunk<string, string>(
  "loansV1/delete",
  async (id) => {
    await deleteLoanRequest(id);
    return id;
  }
);

const loansSlice = createSlice({
  name: "loansV1",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLoans.fulfilled, (state, action: PayloadAction<Loan[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch loans";
      })
      .addCase(createLoan.fulfilled, (state, action: PayloadAction<Loan>) => {
        state.items.push(action.payload);
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        const { id, input } = action.payload;
        const index = state.items.findIndex((loan) => loan.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...input };
        }
      })
      .addCase(deleteLoan.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((loan) => loan.id !== action.payload);
      });
  },
});

export default loansSlice.reducer;

export const selectLoans = (state: { loansV1: LoansState }) =>
  state.loansV1.items;
export const selectLoansStatus = (state: { loansV1: LoansState }) =>
  state.loansV1.status;
export const selectLoansError = (state: { loansV1: LoansState }) =>
  state.loansV1.error;
