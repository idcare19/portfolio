import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";

type MaintenancePatch = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  estimatedReturn?: string;
  contactButtonText?: string;
  contactButtonLink?: string;
  whatsappLink?: string;
  allowedRoutes?: string[];
  whitelistAdmin?: boolean;
};

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const current = await readGitHubJsonFile();
    const maintenance = (current.json as any)?.websiteControl?.maintenanceMode;
    return response(true, "Maintenance settings loaded", maintenance ?? null);
  } catch (error) {
    return response(false, "Failed to load maintenance settings", null, error instanceof Error ? error.message : "Failed", 500);
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const patch = (await request.json()) as MaintenancePatch;
    const current = await readGitHubJsonFile();
    const json = current.json as any;

    const next = {
      ...json,
      websiteControl: {
        ...json.websiteControl,
        maintenanceMode: {
          ...json.websiteControl?.maintenanceMode,
          ...patch,
        },
      },
      updatedAt: new Date().toISOString(),
    };

    const updated = await updateGitHubJsonFile({
      data: next,
      message: "chore: update maintenance settings",
    });

    return response(true, "Maintenance settings saved", {
      commitSha: updated.commit.sha,
      fileSha: updated.content.sha,
      maintenanceMode: next.websiteControl.maintenanceMode,
    });
  } catch (error) {
    return response(false, "Failed to save maintenance settings", null, error instanceof Error ? error.message : "Failed", 500);
  }
}
