import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { readGitHubJsonFile } from "@/lib/github-content";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const current = await readGitHubJsonFile();
    return NextResponse.json({ ok: true, data: current.json });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load content" },
      { status: 500 }
    );
  }
}
