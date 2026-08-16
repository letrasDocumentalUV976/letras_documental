import { InvitationDetails, PublicUser, UserInput, UserInviteInput } from "@/types";
import { getAdminAuth, getAdminFirestore } from "./admin";
import { USERS_COLLECTION } from "./collections";
import {
  createInvitation,
  deleteInvitation,
  getInvitationByToken,
  isInvitationExpired,
  type UserInvitation,
} from "./invitations.service";

const usersCollection = () =>
  getAdminFirestore().collection(USERS_COLLECTION);

const toPublicUser = (
  id: string,
  data: FirebaseFirestore.DocumentData
): PublicUser => ({
  id,
  name: data.name,
  email: data.email,
});

export const getUsers = async (): Promise<PublicUser[]> => {
  const snapshot = await usersCollection().get();
  return snapshot.docs.map((document) =>
    toPublicUser(document.id, document.data())
  );
};

export const getUserById = async (id: string): Promise<PublicUser | null> => {
  const document = await usersCollection().doc(id).get();
  if (!document.exists) return null;
  return toPublicUser(document.id, document.data()!);
};

export const getUserByEmail = async (
  email: string
): Promise<PublicUser | null> => {
  const snapshot = await usersCollection()
    .where("email", "==", email)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const document = snapshot.docs[0];
  return toPublicUser(document.id, document.data());
};

export const USER_ALREADY_EXISTS_ERROR =
  "Ya existe un usuario registrado con este correo";

export const inviteUser = async (
  input: UserInviteInput
): Promise<UserInvitation> => {
  const existingUser = await getUserByEmail(input.email);
  if (existingUser) {
    throw new Error(USER_ALREADY_EXISTS_ERROR);
  }

  return createInvitation(input.name, input.email);
};

export const getInvitationForActivation = async (
  token: string
): Promise<InvitationDetails | null> => {
  const invitation = await getInvitationByToken(token);
  if (!invitation || isInvitationExpired(invitation)) return null;
  return { name: invitation.name, email: invitation.email };
};

export const completeUserInvitation = async (
  token: string,
  password: string
): Promise<PublicUser> => {
  const invitation = await getInvitationByToken(token);
  if (!invitation || isInvitationExpired(invitation)) {
    throw new Error("El enlace de activación no es válido o ha expirado");
  }

  const userRecord = await getAdminAuth().createUser({
    email: invitation.email,
    password,
    displayName: invitation.name,
  });

  await usersCollection().doc(userRecord.uid).set({
    name: invitation.name,
    email: invitation.email,
  });

  await deleteInvitation(token);

  return { id: userRecord.uid, name: invitation.name, email: invitation.email };
};

export const updateUser = async (
  id: string,
  input: Partial<UserInput>
): Promise<void> => {
  const authUpdate: { email?: string; password?: string; displayName?: string } =
    {};
  if (input.email) authUpdate.email = input.email;
  if (input.password) authUpdate.password = input.password;
  if (input.name) authUpdate.displayName = input.name;

  if (Object.keys(authUpdate).length > 0) {
    await getAdminAuth().updateUser(id, authUpdate);
  }

  const profileUpdate: { name?: string; email?: string } = {};
  if (input.name) profileUpdate.name = input.name;
  if (input.email) profileUpdate.email = input.email;

  if (Object.keys(profileUpdate).length > 0) {
    await usersCollection().doc(id).set(profileUpdate, { merge: true });
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  await getAdminAuth().deleteUser(id);
  await usersCollection().doc(id).delete();
};
