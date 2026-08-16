import { createLoan, getLoans } from "@/services/firebase/loans.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { LoanInput } from "@/types";

export async function GET() {
  try {
    const loans = await getLoans();
    return successResponse(loans, "Loans retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve loans", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoanInput;
    const loan = await createLoan(payload);
    return successResponse(loan, "Loan created successfully", 201);
  } catch {
    return errorResponse("Failed to create loan", 500);
  }
}
