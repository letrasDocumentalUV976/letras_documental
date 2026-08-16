import { FirestoreId } from "./common";

export interface User {
  id: FirestoreId;
  name: string;
  email: string;
  lastLogin?: string;
}

export type UserInput = Omit<User, "id"> & { password: string };

export type UserInviteInput = Pick<User, "name" | "email">;

export interface InvitationDetails {
  name: string;
  email: string;
}

export type PublicUser = User;

export type SessionUser = PublicUser;
