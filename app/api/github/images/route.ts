import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { deleteGitHubFile, listGitHubDirectory } from "@/lib/github-content";

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

export async function DELETE(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const path = String(body?.path || "").trim();

    if (!path) {
      return NextResponse.json({ ok: false, error: "Missing file path" }, { status: 400 });
    }

    if (!path.startsWith("public/projects/")) {
      return NextResponse.json({ ok: false, error: "Only files under public/projects can be deleted" }, { status: 400 });
    }

    const result = await deleteGitHubFile({
      path,
      message: `chore: delete image ${path}`,
    });

    return NextResponse.json({
      ok: true,
      path,
      commitSha: result.commit.sha,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete image" },
      { status: 500 }
    );
  }
}
