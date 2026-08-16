import { Loan, LoanInput } from "@/types";
import { requestJson } from "./httpClient";

const LOANS_ENDPOINT = "/api/loans";

export const fetchLoansRequest = () => requestJson<Loan[]>(LOANS_ENDPOINT);

export const createLoanRequest = (input: LoanInput) =>
  requestJson<Loan>(LOANS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateLoanRequest = (id: string, input: Partial<LoanInput>) =>
  requestJson<null>(`${LOANS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteLoanRequest = (id: string) =>
  requestJson<null>(`${LOANS_ENDPOINT}/${id}`, { method: "DELETE" });
