import { collection, getDocs, query, where } from "firebase/firestore";
import { PublicUser, User, UserInput } from "@/types";
import { firestore } from "./app";
import { USERS_COLLECTION } from "./collections";
import { InvalidCredentialsError, UserNotFoundError } from "./errors";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getDocumentById,
  updateDocument,
} from "./repository";

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const getUsers = async (): Promise<PublicUser[]> => {
  const users = await getCollection<User>(USERS_COLLECTION);
  return users.map(toPublicUser);
};

export const getUserById = async (id: string): Promise<PublicUser | null> => {
  const user = await getDocumentById<User>(USERS_COLLECTION, id);
  return user ? toPublicUser(user) : null;
};

export const createUser = async (input: UserInput): Promise<PublicUser> => {
  const user = await createDocument<User>(USERS_COLLECTION, input);
  return toPublicUser(user);
};

export const updateUser = (id: string, input: Partial<UserInput>) =>
  updateDocument(USERS_COLLECTION, id, input);

export const deleteUser = (id: string) => deleteDocument(USERS_COLLECTION, id);

export const authenticateUser = async (
  email: string,
  password: string
): Promise<PublicUser> => {
  const usersQuery = query(
    collection(firestore, USERS_COLLECTION),
    where("email", "==", email)
  );
  const snapshot = await getDocs(usersQuery);
  if (snapshot.empty) {
    throw new UserNotFoundError(email);
  }
  const user = snapshot.docs[0].data() as User;
  if (user.password !== password) {
    throw new InvalidCredentialsError(email);
  }
  return toPublicUser(user);
};
