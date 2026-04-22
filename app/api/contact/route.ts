import { NextResponse } from "next/server";
import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";
import { writeLocalSiteData } from "@/lib/local-site-data";
import { sendContactNotificationEmail } from "@/lib/contact-notification";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const subject = String(body?.subject || "General").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Name, email and message are required" }, { status: 400 });
    }

    const contactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const { json } = await readGitHubJsonFile();
    const nextData = {
      ...json,
      contactMessages: [
        contactMessage,
        ...(Array.isArray(json.contactMessages) ? json.contactMessages : []),
      ],
      updatedAt: new Date().toISOString(),
    };

    await updateGitHubJsonFile({
      data: nextData,
      message: `chore: add contact message from ${name}`,
    });

    const localWriteResult = await writeLocalSiteData(nextData);
    if (!localWriteResult.ok) {
      console.warn("Contact message saved remotely, but failed to update local siteData:", localWriteResult.error);
    }

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
      { ok: false, error: error instanceof Error ? error.message : "Unable to save message" },
      { status: 500 }
    );
  }
}
