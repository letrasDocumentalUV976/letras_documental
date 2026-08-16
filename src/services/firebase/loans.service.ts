import { Loan, LoanInput } from "@/types";
import { LOANS_COLLECTION } from "./collections";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

export const getLoans = () => getCollection<Loan>(LOANS_COLLECTION);

export const getLoanById = (id: string) =>
  getDocumentById<Loan>(LOANS_COLLECTION, id);

export const createLoan = (input: LoanInput) =>
  createDocument<Loan>(LOANS_COLLECTION, input);

export const updateLoan = (id: string, input: Partial<LoanInput>) =>
  updateDocument(LOANS_COLLECTION, id, input);

export const deleteLoan = (id: string) => deleteDocument(LOANS_COLLECTION, id);
