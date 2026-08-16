import { InvitationDetails, PublicUser } from "@/types";
import { requestJson } from "./httpClient";

const INVITATIONS_ENDPOINT = "/api/invitations";

export const getInvitationRequest = (token: string) =>
  requestJson<InvitationDetails>(`${INVITATIONS_ENDPOINT}/${token}`);

export const completeInvitationRequest = (token: string, password: string) =>
  requestJson<PublicUser>(`${INVITATIONS_ENDPOINT}/${token}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
