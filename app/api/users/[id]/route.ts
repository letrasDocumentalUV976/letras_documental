import {
  deleteUser,
  getUserById,
  updateUser,
} from "@/services/firebase/users.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { UserInput } from "@/types";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const user = await getUserById(id);
    if (!user) return errorResponse("User not found", 404);
    return successResponse(user, "User retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve user", 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    const payload = (await request.json()) as Partial<UserInput>;
    await updateUser(id, payload);
    return successResponse(null, "User updated successfully");
  } catch {
    return errorResponse("Failed to update user", 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  try {
    await deleteUser(id);
    return successResponse(null, "User deleted successfully");
  } catch {
    return errorResponse("Failed to delete user", 500);
  }
}
