import { NextResponse } from "next/server";
import { authorizeSiteDataWrite } from "@/lib/admin/server";
import { toPublicSiteData } from "@/lib/public-site-data";
import { DEFAULT_REVALIDATE_PATHS, getSiteContentState, saveSiteData } from "@/lib/site-data-store";
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

function analyzeSiteData(data: ReturnType<typeof toPublicSiteData>) {
  const renderedPaths = Object.keys(data.sections || {}).flatMap((sectionId) => {
    const section = data.sections?.[sectionId];
    if (!section) return [];
    return Object.keys(section.data || {}).map((field) => `sections.${sectionId}.data.${field}`);
  });
  const duplicatePaths = renderedPaths.filter((path, index) => renderedPaths.indexOf(path) !== index);
  return {
    renderedPaths: Array.from(new Set(renderedPaths)),
    duplicatePaths: Array.from(new Set(duplicatePaths)),
    staleFields: [] as string[],
    aboutStats: data.sections?.about?.items ?? [],
    heroTitle: (data.sections?.hero?.data as Record<string, unknown> | undefined)?.title ?? "",
    footerText: (data.sections?.footer?.data as Record<string, unknown> | undefined)?.copyrightText ?? "",
    githubEnabled: Boolean(data.githubConfig?.enabled),
  };
}

export async function GET(request: Request) {
  try {
    const state = await getSiteContentState();
    const siteData = toPublicSiteData(state.data);
    const debug = new URL(request.url).searchParams.get("debug") === "true";
    return noStoreJson({
      ok: true,
      data: siteData,
      updatedAt: siteData.updatedAt || new Date().toISOString(),
      activeSource: state.activeSource,
      source: state.activeSource,
      requestedSource: state.requestedSource,
      fallbackActivated: state.fallbackActivated,
      ...(debug ? analyzeSiteData(siteData) : {}),
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
      activeSource: saved.activeSource,
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      revalidatedPaths: DEFAULT_REVALIDATE_PATHS,
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
