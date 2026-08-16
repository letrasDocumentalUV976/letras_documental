import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const ADMIN_APP_NAME = "documental-admin";

let adminApp: App | null = null;
let cachedAuth: Auth | null = null;
let cachedFirestore: Firestore | null = null;

const getAdminApp = (): App => {
  if (adminApp) return adminApp;

  adminApp =
    getApps().find((app) => app.name === ADMIN_APP_NAME) ??
    initializeApp(
      {
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
        }),
      },
      ADMIN_APP_NAME
    );

  return adminApp;
};

export const getAdminAuth = (): Auth => {
  if (!cachedAuth) cachedAuth = getAuth(getAdminApp());
  return cachedAuth;
};

export const getAdminFirestore = (): Firestore => {
  if (!cachedFirestore) cachedFirestore = getFirestore(getAdminApp());
  return cachedFirestore;
};

const ADMIN_AUTH_ERRORS: Record<string, { message: string; status: number }> = {
  "auth/email-already-exists": {
    message: "El correo ya está registrado",
    status: 409,
  },
  "auth/invalid-password": {
    message: "La contraseña debe tener al menos 6 caracteres",
    status: 400,
  },
  "auth/invalid-email": { message: "El correo no es válido", status: 400 },
  "auth/user-not-found": { message: "El usuario no existe", status: 404 },
};

export const getAdminAuthError = (
  error: unknown
): { message: string; status: number } | null => {
  const code = (error as { code?: string } | null)?.code;
  if (!code) return null;
  return ADMIN_AUTH_ERRORS[code] ?? null;
};
