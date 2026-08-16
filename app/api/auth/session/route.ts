import { NextResponse } from "next/server";
import { getAdminAuth } from "@/services/firebase/admin";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/constants/session";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { message: "Falta el token de sesión" },
        { status: 400 }
      );
    }

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    const response = NextResponse.json({ message: "Sesión iniciada" });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json(
      { message: "No se pudo iniciar sesión" },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
