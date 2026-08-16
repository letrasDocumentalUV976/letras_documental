import { Student, StudentInput } from "@/types";
import { requestJson } from "./httpClient";

const STUDENTS_ENDPOINT = "/api/students";

export const fetchStudentsRequest = () =>
  requestJson<Student[]>(STUDENTS_ENDPOINT);

export const createStudentRequest = (input: StudentInput) =>
  requestJson<Student>(STUDENTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateStudentRequest = (
  id: string,
  input: Partial<StudentInput>
) =>
  requestJson<null>(`${STUDENTS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteStudentRequest = (id: string) =>
  requestJson<null>(`${STUDENTS_ENDPOINT}/${id}`, { method: "DELETE" });
