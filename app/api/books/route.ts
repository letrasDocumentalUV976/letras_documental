import { createBook, getBooks } from "@/services/firebase/books.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { BookInput } from "@/types";

export async function GET() {
  try {
    const books = await getBooks();
    return successResponse(books, "Books retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve books", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookInput;
    const book = await createBook(payload);
    return successResponse(book, "Book created successfully", 201);
  } catch {
    return errorResponse("Failed to create book", 500);
  }
}
