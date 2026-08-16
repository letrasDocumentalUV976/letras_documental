import { randomUUID } from "crypto";
import { USER_INVITATIONS_COLLECTION } from "./collections";
import { getAdminFirestore } from "./admin";
import { setDocument } from "./repository";

export interface UserInvitation {
  token: string;
  name: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

const INVITATION_TTL_DAYS = 7;

const invitationsCollection = () =>
  getAdminFirestore().collection(USER_INVITATIONS_COLLECTION);

export const isInvitationExpired = (invitation: UserInvitation): boolean =>
  new Date(invitation.expiresAt).getTime() < Date.now();

export const getInvitationByToken = async (
  token: string
): Promise<UserInvitation | null> => {
  const document = await invitationsCollection().doc(token).get();
  if (!document.exists) return null;
  return document.data() as UserInvitation;
};

export const deleteInvitation = async (token: string): Promise<void> => {
  await invitationsCollection().doc(token).delete();
};

export const deleteInvitationsForEmail = async (
  email: string
): Promise<void> => {
  const snapshot = await invitationsCollection()
    .where("email", "==", email)
    .get();
  await Promise.all(snapshot.docs.map((document) => document.ref.delete()));
};

export const createInvitation = async (
  name: string,
  email: string
): Promise<UserInvitation> => {
  await deleteInvitationsForEmail(email);

  const createdAt = new Date();
  const expiresAt = new Date(
    createdAt.getTime() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  const invitation: UserInvitation = {
    token: randomUUID(),
    name,
    email,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await setDocument(USER_INVITATIONS_COLLECTION, invitation.token, invitation);
  return invitation;
};
