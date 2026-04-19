import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { listGitHubDirectory } from "@/lib/github-content";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const targetDir = "public/projects";
    const entries = await listGitHubDirectory(targetDir);
    const images = entries
      .filter((entry) => entry.type === "file")
      .map((entry) => ({
        name: entry.name,
        path: entry.path,
        url: `/${entry.path.replace(/^public\//, "")}`,
        size: entry.size,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ ok: true, data: images });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to list images" },
      { status: 500 }
    );
  }
}
