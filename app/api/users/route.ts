import { getAdminAuthError } from "@/services/firebase/admin";
import {
  createUser,
  getUserByEmail,
  getUsers,
} from "@/services/firebase/users.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { UserInput } from "@/types";

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");

  try {
    if (email) {
      const user = await getUserByEmail(email);
      if (!user) return errorResponse("User not found", 404);
      return successResponse(user, "User retrieved successfully");
    }

    const users = await getUsers();
    return successResponse(users, "Users retrieved successfully");
  } catch {
    return errorResponse("Failed to retrieve users", 500);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as UserInput;
    const user = await createUser(payload);
    return successResponse(user, "User created successfully", 201);
  } catch (error) {
    const authError = getAdminAuthError(error);
    return errorResponse(
      authError?.message ?? "Failed to create user",
      authError?.status ?? 500
    );
  }
}
