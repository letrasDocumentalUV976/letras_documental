import { getAdminAuthError } from "@/services/firebase/admin";
import {
  completeUserInvitation,
  getInvitationForActivation,
} from "@/services/firebase/users.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { token } = await params;

  try {
    const invitation = await getInvitationForActivation(token);
    if (!invitation) {
      return errorResponse(
        "El enlace de activación no es válido o ha expirado",
        404
      );
    }
    return successResponse(invitation, "Invitation retrieved successfully");
  } catch {
    return errorResponse("No se pudo validar el enlace", 500);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const { token } = await params;

  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string" || password.length < 6) {
      return errorResponse(
        "La contraseña debe tener al menos 6 caracteres",
        400
      );
    }

    const user = await completeUserInvitation(token, password);
    return successResponse(user, "Cuenta activada correctamente", 201);
  } catch (error) {
    const authError = getAdminAuthError(error);
    if (authError) {
      return errorResponse(authError.message, authError.status);
    }

    if (error instanceof Error && error.message) {
      return errorResponse(error.message, 400);
    }

    return errorResponse("No se pudo activar la cuenta", 500);
  }
}
