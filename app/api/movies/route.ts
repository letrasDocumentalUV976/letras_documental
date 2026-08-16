import { createMovie, getMovies } from "@/services/firebase/movies.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { MovieInput } from "@/types";

export async function GET() {
  try {
    const movies = await getMovies();
    return successResponse(movies, "Movies retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve movies", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MovieInput;
    const movie = await createMovie(payload);
    return successResponse(movie, "Movie created successfully", 201);
  } catch {
    return errorResponse("Failed to create movie", 500);
  }
}
