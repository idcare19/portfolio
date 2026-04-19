import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

type Params = { params: Promise<{ section: string }> };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { section } = await params;

  try {
    const current = await readGitHubJsonFile();
    const sectionData = (current.json as Record<string, unknown>)[section];
    if (typeof sectionData === "undefined") {
      return response(false, "Section not found", null, `Unknown section: ${section}`, 404);
    }

    return response(true, "Section loaded", { section, value: sectionData });
  } catch (error) {
    return response(false, "Failed to load section", null, error instanceof Error ? error.message : "Failed to load", 500);
  }
}

export async function PUT(request: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { section } = await params;

  try {
    const body = await request.json();
    if (typeof body?.value === "undefined") {
      return response(false, "Invalid payload", null, "value is required", 400);
    }

    const current = await readGitHubJsonFile();
    const next = {
      ...(current.json as Record<string, unknown>),
      [section]: body.value,
      updatedAt: new Date().toISOString(),
    };

    const commitMessage = String(body?.commitMessage || `chore: update ${section} section`).replace(/[\r\n]+/g, " ").slice(0, 140);
    const updated = await updateGitHubJsonFile({
      data: next,
      message: commitMessage,
    });

    return response(true, "Section saved", {
      section,
      commitSha: updated.commit.sha,
      fileSha: updated.content.sha,
      value: next[section],
    });
  } catch (error) {
    return response(false, "Failed to save section", null, error instanceof Error ? error.message : "Failed to save", 500);
  }
}
