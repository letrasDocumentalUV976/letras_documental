import { CreateInput, FirestoreId } from "./common";

export interface User {
  id: FirestoreId;
  name: string;
  email: string;
  password: string;
}

export type UserInput = CreateInput<User>;

export type PublicUser = Omit<User, "password">;

export type SessionUser = PublicUser;
