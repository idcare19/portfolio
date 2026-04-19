import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";

type SyncBody = {
  action?: "pull" | "push";
  commitMessage?: string;
  data?: unknown;
  githubConfig?: {
    token?: string;
    owner?: string;
    repo?: string;
    branch?: string;
    contentPath?: string;
  };
};

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

function parseProjectConfig(body: SyncBody) {
  const cfg = body.githubConfig;
  if (!cfg) return undefined;
  return {
    token: typeof cfg.token === "string" ? cfg.token.trim() : undefined,
    owner: String(cfg.owner || "").trim(),
    repo: String(cfg.repo || "").trim(),
    branch: String(cfg.branch || "main").trim() || "main",
    contentPath: String(cfg.contentPath || "src/data/siteData.json").trim() || "src/data/siteData.json",
  };
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as SyncBody;
    const action = body.action || "pull";
    const projectConfig = parseProjectConfig(body);

    if (action === "pull") {
      const current = await readGitHubJsonFile(undefined, projectConfig);
      return response(true, "Content synced from GitHub", {
        data: current.json,
        sha: current.sha,
      });
    }

    if (!body.data || typeof body.data !== "object") {
      return response(false, "Invalid payload", null, "data object is required for push", 400);
    }

    const commitMessage = String(body.commitMessage || "chore: sync content from admin panel")
      .replace(/[\r\n]+/g, " ")
      .slice(0, 140)
      .trim();

    const updated = await updateGitHubJsonFile({
      data: body.data,
      message: commitMessage,
      projectConfig,
    });

    return response(true, "Content pushed to GitHub", {
      commitSha: updated.commit.sha,
      fileSha: updated.content.sha,
    });
  } catch (error) {
    return response(false, "GitHub sync failed", null, error instanceof Error ? error.message : "Sync failed", 500);
  }
}
