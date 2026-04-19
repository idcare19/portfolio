import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";
import { siteDataSchema } from "@/schemas/site-data";

function sanitizeCommitMessage(input: string) {
  return input.replace(/[\r\n]+/g, " ").slice(0, 140).trim() || "chore: update website content";
}

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

function parseProjectConfig(body: any) {
  const config = body?.githubConfig;
  if (!config || typeof config !== "object") return undefined;

  return {
    token: typeof config.token === "string" ? config.token.trim() : undefined,
    owner: String(config.owner || "").trim(),
    repo: String(config.repo || "").trim(),
    branch: String(config.branch || "main").trim() || "main",
    contentPath: String(config.contentPath || "src/data/siteData.json").trim() || "src/data/siteData.json",
  };
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const current = await readGitHubJsonFile();
    return response(true, "Content loaded", current.json);
  } catch (error) {
    return response(false, "Failed to load content", null, error instanceof Error ? error.message : "Failed to load content", 500);
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const payload = body?.data;
    const commitMessage = sanitizeCommitMessage(String(body?.commitMessage || "chore: update website content via admin"));
    const projectConfig = parseProjectConfig(body);

    if (!payload || typeof payload !== "object") {
      return response(false, "Invalid payload", null, "Expected data object", 400);
    }

    const parsed = siteDataSchema.safeParse(payload);
    if (!parsed.success) {
      return response(false, "Validation failed", null, parsed.error.issues[0]?.message || "Invalid site data", 400);
    }

    const dataToSave = {
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateGitHubJsonFile({
      data: dataToSave,
      message: commitMessage,
      projectConfig,
    });

    return response(true, "Content saved to GitHub", {
      commitSha: updated.commit.sha,
      fileSha: updated.content.sha,
      updatedAt: dataToSave.updatedAt,
      data: dataToSave,
    });
  } catch (error) {
    return response(false, "Failed to save content", null, error instanceof Error ? error.message : "Failed to save", 500);
  }
}
