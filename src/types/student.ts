import { CreateInput, FirestoreId } from "./common";

export interface Student {
  id: FirestoreId;
  name: string;
  enrollmentNumber: string;
  email: string;
}

export type StudentInput = CreateInput<Student>;
