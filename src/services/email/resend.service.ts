import { Resend } from "resend";

let client: Resend | null = null;

const getResendClient = (): Resend => {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
};

const DEFAULT_FROM =
  "Facultad de Letras Españolas <onboarding@letrasdocumental.com>";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const emailLayout = (content: string): string => `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
            <tr>
              <td style="background-color:#18529d;padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;">Centro Documental</span>
                <div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:2px;">Facultad de Letras Españolas</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
                <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.5;">
                  Este es un mensaje automático del Centro Documental — Facultad de Letras Españolas. Por favor no respondas a este correo.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

interface OverdueLoanEmailParams {
  to: string;
  studentName?: string;
  bookTitle?: string;
  returnDate?: string;
}

const overdueLoanEmailHtml = ({
  studentName,
  bookTitle,
  returnDate,
}: Omit<OverdueLoanEmailParams, "to">): string => {
  const greeting = studentName
    ? `Hola ${escapeHtml(studentName)},`
    : "Hola,";

  const detailsRows = [
    bookTitle &&
      `<p style="margin:0 0 4px;color:#92400e;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;">Material</p>
       <p style="margin:0 0 12px;color:#1f2937;font-size:14px;">${escapeHtml(bookTitle)}</p>`,
    returnDate &&
      `<p style="margin:0 0 4px;color:#92400e;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;">Fecha de devolución</p>
       <p style="margin:0;color:#b45309;font-size:14px;font-weight:700;">${escapeHtml(returnDate)} (vencido)</p>`,
  ]
    .filter(Boolean)
    .join("");

  return emailLayout(`
    <p style="margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.5;">${greeting}</p>
    <p style="margin:0 0 20px;color:#1f2937;font-size:15px;line-height:1.5;">
      Te recordamos que tienes material pendiente por entregar en el Centro Documental.
    </p>
    ${
      detailsRows
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef3c7;border-radius:8px;margin-bottom:20px;">
             <tr><td style="padding:16px 20px;">${detailsRows}</td></tr>
           </table>`
        : ""
    }
    <p style="margin:0;color:#1f2937;font-size:15px;line-height:1.5;">
      Por favor acércate lo antes posible a devolverlo. Si ya lo entregaste, puedes ignorar este mensaje.
    </p>
  `);
};

const overdueLoanEmailText = ({
  studentName,
  bookTitle,
  returnDate,
}: Omit<OverdueLoanEmailParams, "to">): string =>
  [
    studentName ? `Hola ${studentName},` : "Hola,",
    "",
    "Te recordamos que tienes material pendiente por entregar en el Centro Documental.",
    bookTitle ? `Material: ${bookTitle}` : null,
    returnDate ? `Fecha de devolución: ${returnDate} (vencido)` : null,
    "",
    "Por favor acércate lo antes posible a devolverlo. Si ya lo entregaste, puedes ignorar este mensaje.",
    "",
    "Centro Documental — Facultad de Letras Españolas",
  ]
    .filter((line) => line !== null)
    .join("\n");

export const sendOverdueLoanEmail = async ({
  to,
  studentName,
  bookTitle,
  returnDate,
}: OverdueLoanEmailParams): Promise<void> => {
  const { error } = await getResendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM,
    to,
    subject: "Recordatorio: tienes una entrega pendiente en el Centro Documental",
    html: overdueLoanEmailHtml({ studentName, bookTitle, returnDate }),
    text: overdueLoanEmailText({ studentName, bookTitle, returnDate }),
  });

  if (error) {
    throw new Error(error.message);
  }
};

interface UserInvitationEmailParams {
  to: string;
  name: string;
  activationUrl: string;
}

const userInvitationEmailHtml = ({
  name,
  activationUrl,
}: Omit<UserInvitationEmailParams, "to">): string =>
  emailLayout(`
    <p style="margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.5;">Hola ${escapeHtml(name)},</p>
    <p style="margin:0 0 24px;color:#1f2937;font-size:15px;line-height:1.5;">
      Se creó una cuenta para ti en el Centro Documental. Para comenzar a usarla, define tu contraseña dando clic en el siguiente botón.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="border-radius:8px;background-color:#18529d;">
          <a href="${activationUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Crear mi contraseña</a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;color:#6b7280;font-size:12px;line-height:1.5;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:
    </p>
    <p style="margin:0;word-break:break-all;color:#18529d;font-size:12px;">${activationUrl}</p>
  `);

const userInvitationEmailText = ({
  name,
  activationUrl,
}: Omit<UserInvitationEmailParams, "to">): string =>
  [
    `Hola ${name},`,
    "",
    "Se creó una cuenta para ti en el Centro Documental. Para comenzar a usarla, define tu contraseña en el siguiente enlace:",
    activationUrl,
    "",
    "Centro Documental — Facultad de Letras Españolas",
  ].join("\n");

export const sendUserInvitationEmail = async ({
  to,
  name,
  activationUrl,
}: UserInvitationEmailParams): Promise<void> => {
  const { error } = await getResendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM,
    to,
    subject: "Activa tu cuenta del Centro Documental",
    html: userInvitationEmailHtml({ name, activationUrl }),
    text: userInvitationEmailText({ name, activationUrl }),
  });

  if (error) {
    throw new Error(error.message);
  }
};
