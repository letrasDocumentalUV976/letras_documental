import { authenticateUser } from "@/services/firebase/users.service";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "@/services/firebase/errors";
import { errorResponse, successResponse } from "@/services/http/apiResponse";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  try {
    const user = await authenticateUser(email, password);
    return successResponse(user, "User authenticated successfully");
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return errorResponse("User not found", 404);
    }
    if (error instanceof InvalidCredentialsError) {
      return errorResponse("Invalid credentials", 401);
    }
    return errorResponse("Failed to authenticate user", 500);
  }
}
