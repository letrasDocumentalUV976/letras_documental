import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { PublicUser } from "@/types";
import { auth } from "./app";

const toPublicUser = (user: FirebaseUser): PublicUser => ({
  id: user.uid,
  name: user.displayName ?? user.email ?? "Usuario",
  email: user.email ?? "",
});

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Correo o contraseña incorrectos",
  "auth/invalid-email": "El correo no es válido",
  "auth/user-not-found": "Correo o contraseña incorrectos",
  "auth/wrong-password": "Correo o contraseña incorrectos",
  "auth/user-disabled": "Esta cuenta ha sido deshabilitada",
  "auth/too-many-requests": "Demasiados intentos. Intenta de nuevo más tarde",
};

export const mapAuthError = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? "Error al iniciar sesión";
  }
  return "Error al iniciar sesión";
};

export const signIn = async (
  email: string,
  password: string
): Promise<PublicUser> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toPublicUser(credential.user);
};

export const signOutUser = () => signOut(auth);

export const subscribeToAuthChanges = (
  callback: (user: PublicUser | null) => void
) => onAuthStateChanged(auth, (user) => callback(user ? toPublicUser(user) : null));
