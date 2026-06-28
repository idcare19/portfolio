import { NextResponse } from "next/server";
import { sendContactNotificationEmail } from "@/lib/contact-notification";
import { createPortfolioMessage } from "@/lib/portfolio/repository";
import {
  enforceContactRateLimit,
  getClientIp,
  isValidEmail,
  sanitizeContactInput,
} from "@/lib/contact-guard";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const body = await request.json();

    const name = sanitizeContactInput(String(body?.name || ""), 100);
    const email = sanitizeContactInput(String(body?.email || "").toLowerCase(), 150);
    const message = sanitizeContactInput(String(body?.message || ""), 5000);
    const subject = sanitizeContactInput(String(body?.subject || "General"), 200);

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Name, email and message are required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email format" }, { status: 400 });
    }

    try {
      await enforceContactRateLimit({ email, ip });
    } catch (rateLimitError: any) {
      return NextResponse.json({ ok: false, error: rateLimitError.message || "Too many requests" }, { status: 429 });
    }
    const contactMessage = await createPortfolioMessage({
      name,
      email,
      subject: subject || "General",
      message,
      ipAddress: ip,
    });

    const notification = await sendContactNotificationEmail(contactMessage);
    if (!notification.sent) {
      if (notification.skipped) {
        console.warn("Contact message email notification skipped:", notification.reason);
      } else {
        console.error("Contact message email notification failed:", notification.error);
      }
    }

    return NextResponse.json({ ok: true, notificationSent: notification.sent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Unable to process message" },
      { status: 500 }
    );
  }
}
