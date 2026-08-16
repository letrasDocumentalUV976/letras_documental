import { FirestoreId } from "./common";

export interface User {
  id: FirestoreId;
  name: string;
  email: string;
}

export type UserInput = Omit<User, "id"> & { password: string };

export type PublicUser = User;

export type SessionUser = PublicUser;
