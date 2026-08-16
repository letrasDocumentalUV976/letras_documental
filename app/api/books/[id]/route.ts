import {
  BOOK_LOANED_ERROR,
  deleteBook,
  getBookById,
  updateBook,
} from "@/services/firebase/books.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { BookInput } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const book = await getBookById(id);
    if (!book) return errorResponse("Book not found", 404);
    return successResponse(book, "Book retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve book", 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const payload = (await request.json()) as Partial<BookInput>;
    await updateBook(id, payload);
    return successResponse(null, "Book updated successfully");
  } catch (error) {
    if (error instanceof Error && error.message === BOOK_LOANED_ERROR) {
      return errorResponse(error.message, 409);
    }
    return errorResponse("Failed to update book", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await deleteBook(id);
    return successResponse(null, "Book deleted successfully");
  } catch (error) {
    if (error instanceof Error && error.message === BOOK_LOANED_ERROR) {
      return errorResponse(error.message, 409);
    }
    return errorResponse("Failed to delete book", 500);
  }
}
