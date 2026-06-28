import { NextResponse } from "next/server";
import { authorizeSiteDataWrite } from "@/lib/admin/server";
<<<<<<< HEAD
import { toPublicSiteData } from "@/lib/public-site-data";
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
import { getSiteContentState, saveSiteData } from "@/lib/site-data-store";
import { normalizeSiteData } from "@/lib/site-data-transform";
import { siteDataSchema } from "@/schemas/site-data";
import type { SiteData } from "@/src/types/site-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function noStoreJson(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...(init?.headers || {}),
    },
  });
}

export async function GET() {
  try {
    const state = await getSiteContentState();
<<<<<<< HEAD
    const siteData = toPublicSiteData(state.data);
=======
    const siteData = state.data;
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    return noStoreJson({
      ok: true,
      data: siteData,
      updatedAt: siteData.updatedAt || new Date().toISOString(),
      source: state.activeSource,
      requestedSource: state.requestedSource,
      fallbackActivated: state.fallbackActivated,
      meta: {
        lastMongoUpdateAt: state.lastMongoUpdateAt,
        lastGitHubSyncAt: state.lastGitHubSyncAt,
      },
    });
  } catch (error) {
    return noStoreJson(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to fetch site data",
        data: null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const auth = await authorizeSiteDataWrite(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const incoming = body?.data || body;
    const parsed = siteDataSchema.safeParse(incoming);

    if (!parsed.success) {
      return noStoreJson(
        {
          ok: false,
          error: parsed.error.issues[0]?.message || "Invalid site data payload",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const saved = await saveSiteData(normalizeSiteData(parsed.data as SiteData));

    return noStoreJson({
      ok: true,
      data: saved.data,
      updatedAt: saved.data.updatedAt,
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      meta: {
        lastMongoUpdateAt: saved.lastMongoUpdateAt,
        lastGitHubSyncAt: saved.lastGitHubSyncAt,
      },
      authMode: auth.mode,
      message: "Portfolio content updated",
    });
  } catch (error) {
    return noStoreJson(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to update site data",
      },
      { status: 500 }
    );
  }
}
