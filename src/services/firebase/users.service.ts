import { PublicUser, UserInput } from "@/types";
import { getAdminAuth, getAdminFirestore } from "./admin";
import { USERS_COLLECTION } from "./collections";

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

export const createUser = async (input: UserInput): Promise<PublicUser> => {
  const userRecord = await getAdminAuth().createUser({
    email: input.email,
    password: input.password,
    displayName: input.name,
  });

  await usersCollection().doc(userRecord.uid).set({
    name: input.name,
    email: input.email,
  });

  return { id: userRecord.uid, name: input.name, email: input.email };
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
