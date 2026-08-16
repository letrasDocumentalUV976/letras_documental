import { PublicUser } from "@/types";
import { requestJson } from "./httpClient";

export const loginRequest = (email: string, password: string) =>
  requestJson<PublicUser>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
