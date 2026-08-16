import { Student, StudentInput } from "@/types";
import { STUDENTS_COLLECTION } from "./collections";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

export const getStudents = () => getCollection<Student>(STUDENTS_COLLECTION);

export const getStudentById = (id: string) =>
  getDocumentById<Student>(STUDENTS_COLLECTION, id);

export const createStudent = (input: StudentInput) =>
  createDocument<Student>(STUDENTS_COLLECTION, input);

export const updateStudent = (id: string, input: Partial<StudentInput>) =>
  updateDocument(STUDENTS_COLLECTION, id, input);

export const deleteStudent = (id: string) =>
  deleteDocument(STUDENTS_COLLECTION, id);
