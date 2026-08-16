import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { PublicUser } from "@/types";
import { auth } from "./app";

const resolveUserName = async (user: FirebaseUser): Promise<string> => {
  if (user.displayName) return user.displayName;
  if (!user.email) return "Usuario";

  try {
    const response = await fetch(
      `/api/users?email=${encodeURIComponent(user.email)}`
    );
    if (response.ok) {
      const { data } = await response.json();
      if (data?.name) return data.name;
    }
  } catch {
    // Se ignora y se usa el correo como respaldo
  }

  return user.email;
};

const toPublicUser = async (user: FirebaseUser): Promise<PublicUser> => ({
  id: user.uid,
  name: await resolveUserName(user),
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
) =>
  onAuthStateChanged(auth, async (user) => {
    callback(user ? await toPublicUser(user) : null);
  });
