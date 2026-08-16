import { getAdminAuthError } from "@/services/firebase/admin";
import { createUser, getUsers } from "@/services/firebase/users.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { UserInput } from "@/types";

export async function GET() {
  try {
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
