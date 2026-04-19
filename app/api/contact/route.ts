import { NextResponse } from "next/server";
import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";

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

    const { json } = await readGitHubJsonFile();
    const nextData = {
      ...json,
      contactMessages: [
        ...(Array.isArray(json.contactMessages) ? json.contactMessages : []),
        {
          id: `msg-${Date.now()}`,
          name,
          email,
          subject,
          message,
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    await updateGitHubJsonFile({
      data: nextData,
      message: `chore: add contact message from ${name}`,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save message" },
      { status: 500 }
    );
  }
}
