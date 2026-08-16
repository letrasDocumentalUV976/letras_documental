import { Book } from "./book";
import { CreateInput, DateString, FirestoreId } from "./common";
import { Student } from "./student";

export type LoanStatus = "Loaned" | "Returned";

export interface Loan {
  id: FirestoreId;
  book: Book;
  student: Student;
  loanDate: DateString;
  returnDate: DateString;
  status: LoanStatus;
}

export type LoanInput = CreateInput<Loan>;
