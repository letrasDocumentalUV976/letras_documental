import {
  deleteLoan,
  getLoanById,
  updateLoan,
} from "@/services/firebase/loans.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { LoanInput } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const loan = await getLoanById(id);
    if (!loan) return errorResponse("Loan not found", 404);
    return successResponse(loan, "Loan retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve loan", 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const payload = (await request.json()) as Partial<LoanInput>;
    await updateLoan(id, payload);
    return successResponse(null, "Loan updated successfully");
  } catch {
    return errorResponse("Failed to update loan", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await deleteLoan(id);
    return successResponse(null, "Loan deleted successfully");
  } catch {
    return errorResponse("Failed to delete loan", 500);
  }
}
