import { NextResponse } from "next/server";
import { sendContactNotificationEmail } from "@/lib/contact-notification";
import { createPortfolioMessage } from "@/lib/portfolio/repository";
<<<<<<< HEAD
import {
  enforceContactRateLimit,
  getClientIp,
  isValidEmail,
  sanitizeContactInput,
} from "@/lib/contact-guard";
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
<<<<<<< HEAD
    const ip = getClientIp(request);
    const body = await request.json();

    const name = sanitizeContactInput(String(body?.name || ""), 100);
    const email = sanitizeContactInput(String(body?.email || "").toLowerCase(), 150);
    const message = sanitizeContactInput(String(body?.message || ""), 5000);
    const subject = sanitizeContactInput(String(body?.subject || "General"), 200);
=======
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const subject = String(body?.subject || "General").trim();
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Name, email and message are required" }, { status: 400 });
    }

<<<<<<< HEAD
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email format" }, { status: 400 });
    }

    try {
      await enforceContactRateLimit({ email, ip });
    } catch (rateLimitError: any) {
      return NextResponse.json({ ok: false, error: rateLimitError.message || "Too many requests" }, { status: 429 });
    }

=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    const contactMessage = await createPortfolioMessage({
      name,
      email,
      subject: subject || "General",
      message,
<<<<<<< HEAD
      ipAddress: ip,
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    });

    const notification = await sendContactNotificationEmail(contactMessage);
    if (!notification.sent) {
      if (notification.skipped) {
<<<<<<< HEAD
        // Skip log
      } else {
        // General fail log
        console.error("Contact notification dispatch failed.");
=======
        console.warn("Contact message email notification skipped:", notification.reason);
      } else {
        console.error("Contact message email notification failed:", notification.error);
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
      }
    }

    return NextResponse.json({ ok: true, notificationSent: notification.sent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
<<<<<<< HEAD
      { ok: false, error: "Unable to process message" },
=======
      { ok: false, error: error instanceof Error ? error.message : "Unable to save message" },
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
      { status: 500 }
    );
  }
}
