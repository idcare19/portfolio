import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getSiteContentState, saveSiteData } from "@/lib/site-data-store";

export const runtime = "nodejs";

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

type Params = { params: Promise<{ section: string }> };

export async function GET(_: Request, { params }: Params) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const { section } = await params;

  try {
    const state = await getSiteContentState();
    const sectionData = (state.data as Record<string, unknown>)[section];
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

    const state = await getSiteContentState("mongodb");
    const next = {
      ...(state.data as Record<string, unknown>),
      [section]: body.value,
      updatedAt: new Date().toISOString(),
    } as any;
    const saved = await saveSiteData(next);

    return response(true, "Section saved", {
      section,
      value: (saved.data as Record<string, unknown>)[section],
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      meta: {
        lastMongoUpdateAt: saved.lastMongoUpdateAt,
        lastGitHubSyncAt: saved.lastGitHubSyncAt,
      },
    });
  } catch (error) {
    return response(false, "Failed to save section", null, error instanceof Error ? error.message : "Failed to save", 500);
  }
}
