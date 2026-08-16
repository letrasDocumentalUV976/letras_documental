import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Student, StudentInput } from "@/types";
import {
  createStudentRequest,
  deleteStudentRequest,
  fetchStudentsRequest,
  updateStudentRequest,
} from "../api/studentsApi";
import { RequestStatus } from "../requestStatus";

export interface StudentsState {
  items: Student[];
  status: RequestStatus;
  error: string | null;
}

const initialState: StudentsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchStudents = createAsyncThunk<Student[]>(
  "studentsV1/fetchAll",
  () => fetchStudentsRequest()
);

export const createStudent = createAsyncThunk<Student, StudentInput>(
  "studentsV1/create",
  (input) => createStudentRequest(input)
);

export const updateStudent = createAsyncThunk<
  { id: string; input: Partial<StudentInput> },
  { id: string; input: Partial<StudentInput> }
>("studentsV1/update", async ({ id, input }) => {
  await updateStudentRequest(id, input);
  return { id, input };
});

export const deleteStudent = createAsyncThunk<string, string>(
  "studentsV1/delete",
  async (id) => {
    await deleteStudentRequest(id);
    return id;
  }
);

const studentsSlice = createSlice({
  name: "studentsV1",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchStudents.fulfilled,
        (state, action: PayloadAction<Student[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch students";
      })
      .addCase(
        createStudent.fulfilled,
        (state, action: PayloadAction<Student>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(updateStudent.fulfilled, (state, action) => {
        const { id, input } = action.payload;
        const index = state.items.findIndex((student) => student.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...input };
        }
      })
      .addCase(
        deleteStudent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (student) => student.id !== action.payload
          );
        }
      );
  },
});

export default studentsSlice.reducer;

export const selectStudents = (state: { studentsV1: StudentsState }) =>
  state.studentsV1.items;
export const selectStudentsStatus = (state: { studentsV1: StudentsState }) =>
  state.studentsV1.status;
export const selectStudentsError = (state: { studentsV1: StudentsState }) =>
  state.studentsV1.error;
