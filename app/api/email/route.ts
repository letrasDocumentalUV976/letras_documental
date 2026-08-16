import { NextResponse } from "next/server";
import { sendOverdueLoanEmail } from "@/services/email/resend.service";

export async function POST(req: Request) {
  const { email, studentName, bookTitle, returnDate } = await req.json();

  if (!email) {
    return NextResponse.json({
      message: "Debes indicar el correo del estudiante",
      status: 400,
    });
  }

  try {
    await sendOverdueLoanEmail({ to: email, studentName, bookTitle, returnDate });
    return NextResponse.json({
      message: "Se le ha notificado al estudiante.",
      status: 200,
    });
  } catch (e) {
    console.error("Error al enviar el correo:", e);
    return NextResponse.json({
      message: "No fue posible notificar al estudiante, intente de nuevo.",
      status: 400,
    });
  }
}
