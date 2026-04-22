import nodemailer from "nodemailer";

type ContactNotificationInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

type ContactNotificationResult =
  | { sent: true; messageId: string }
  | { sent: false; skipped: true; reason: string }
  | { sent: false; skipped?: false; error: string };

type ContactEmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from: string;
  to: string;
};

function toBool(value: string | undefined) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

function cleanHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveEmailConfig():
  | { ok: true; config: ContactEmailConfig }
  | { ok: false; reason: string } {
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const host = (process.env.SMTP_HOST || (resendApiKey ? "smtp.resend.com" : "")).trim();
  const to = (process.env.CONTACT_NOTIFICATION_TO || process.env.ADMIN_EMAIL || "").trim();
  const user = (process.env.SMTP_USER || (resendApiKey ? "resend" : "")).trim();
  const pass = process.env.SMTP_PASS || resendApiKey || "";
  const from = (process.env.CONTACT_NOTIFICATION_FROM || process.env.RESEND_FROM_EMAIL || "").trim();

  const defaultPort = resendApiKey ? "465" : "587";
  const parsedPort = Number(process.env.SMTP_PORT || defaultPort);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 587;
  const secure = toBool(process.env.SMTP_SECURE) ?? port === 465;

  if (!host) {
    return { ok: false, reason: "SMTP_HOST is missing (or set RESEND_API_KEY for automatic Resend SMTP)" };
  }

  if (!to) {
    return { ok: false, reason: "CONTACT_NOTIFICATION_TO or ADMIN_EMAIL is missing" };
  }

  if (!from) {
    return { ok: false, reason: "CONTACT_NOTIFICATION_FROM or RESEND_FROM_EMAIL is missing" };
  }

  if ((user && !pass) || (!user && pass)) {
    return { ok: false, reason: "Set both SMTP_USER and SMTP_PASS together" };
  }

  return {
    ok: true,
    config: {
      host,
      port,
      secure,
      user: user || undefined,
      pass: pass || undefined,
      from,
      to,
    },
  };
}

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

export async function sendContactNotificationEmail(
  payload: ContactNotificationInput
): Promise<ContactNotificationResult> {
  const resolved = resolveEmailConfig();
  if (!resolved.ok) {
    return { sent: false, skipped: true, reason: resolved.reason };
  }

  const transporter = nodemailer.createTransport({
    host: resolved.config.host,
    port: resolved.config.port,
    secure: resolved.config.secure,
    auth:
      resolved.config.user && resolved.config.pass
        ? {
            user: resolved.config.user,
            pass: resolved.config.pass,
          }
        : undefined,
  });

  const safeName = cleanHeaderValue(payload.name);
  const safeEmail = cleanHeaderValue(payload.email);
  const safeSubject = cleanHeaderValue(payload.subject || "Website Contact Form");
  const submittedAt = formatSubmittedAt(payload.createdAt);

  const text = [
    "New message from your portfolio contact form.",
    "",
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    `Subject: ${safeSubject}`,
    `Submitted At: ${submittedAt}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
      <h2 style="margin:0 0 12px;">New Contact Form Message</h2>
      <p style="margin:0 0 10px;"><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p style="margin:0 0 10px;"><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      <p style="margin:0 0 10px;"><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
      <p style="margin:0 0 10px;"><strong>Submitted At:</strong> ${escapeHtml(submittedAt)}</p>
      <p style="margin:0 0 6px;"><strong>Message:</strong></p>
      <p style="margin:0;white-space:pre-line;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;">
        ${escapeHtml(payload.message)}
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: resolved.config.from,
      to: resolved.config.to,
      replyTo: safeEmail,
      subject: `[Portfolio] ${safeSubject}`,
      text,
      html,
    });

    return { sent: true, messageId: info.messageId };
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Failed to send notification email",
    };
  }
}
