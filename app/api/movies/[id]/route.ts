import {
  deleteMovie,
  getMovieById,
  updateMovie,
} from "@/services/firebase/movies.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { MovieInput } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const movie = await getMovieById(id);
    if (!movie) return errorResponse("Movie not found", 404);
    return successResponse(movie, "Movie retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve movie", 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const payload = (await request.json()) as Partial<MovieInput>;
    await updateMovie(id, payload);
    return successResponse(null, "Movie updated successfully");
  } catch {
    return errorResponse("Failed to update movie", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await deleteMovie(id);
    return successResponse(null, "Movie deleted successfully");
  } catch {
    return errorResponse("Failed to delete movie", 500);
  }
}
