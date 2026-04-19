import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { updateGitHubJsonFile } from "@/lib/github-content";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const data = body?.data;
    const commitMessage = String(body?.commitMessage || "chore: update portfolio content via admin");

    if (!data || typeof data !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid payload: data object required" }, { status: 400 });
    }

    const result = await updateGitHubJsonFile({
      data,
      message: commitMessage,
    });

    return NextResponse.json({
      ok: true,
      commitSha: result.commit.sha,
      fileSha: result.content.sha,
      message: "Content committed to GitHub. Vercel redeploy should start automatically.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "GitHub update failed" },
      { status: 500 }
    );
  }
}
