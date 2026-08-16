import { sendUserInvitationEmail } from "@/services/email/resend.service";
import { deleteInvitation } from "@/services/firebase/invitations.service";
import {
  USER_ALREADY_EXISTS_ERROR,
  getUserByEmail,
  getUsers,
  inviteUser,
} from "@/services/firebase/users.service";
import { errorResponse, successResponse } from "@/services/http/apiResponse";
import { UserInviteInput } from "@/types";

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
  let token: string | undefined;

  try {
    const payload = (await request.json()) as UserInviteInput;
    const invitation = await inviteUser(payload);
    token = invitation.token;

    const origin = new URL(request.url).origin;
    const activationUrl = `${origin}/activate-account/${invitation.token}`;

    await sendUserInvitationEmail({
      to: invitation.email,
      name: invitation.name,
      activationUrl,
    });

    return successResponse(
      null,
      "Se envió un correo de invitación al usuario",
      201
    );
  } catch (error) {
    if (token) {
      await deleteInvitation(token).catch(() => {});
    }

    if (error instanceof Error && error.message === USER_ALREADY_EXISTS_ERROR) {
      return errorResponse(error.message, 409);
    }

    return errorResponse("No se pudo enviar la invitación", 500);
  }
}
