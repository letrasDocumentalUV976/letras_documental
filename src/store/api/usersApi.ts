import { PublicUser, UserInput } from "@/types";
import { requestJson } from "./httpClient";

const USERS_ENDPOINT = "/api/users";

export const fetchUsersRequest = () =>
  requestJson<PublicUser[]>(USERS_ENDPOINT);

export const createUserRequest = (input: UserInput) =>
  requestJson<PublicUser>(USERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateUserRequest = (id: string, input: Partial<UserInput>) =>
  requestJson<null>(`${USERS_ENDPOINT}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

export const deleteUserRequest = (id: string) =>
  requestJson<null>(`${USERS_ENDPOINT}/${id}`, { method: "DELETE" });
