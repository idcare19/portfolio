import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getSiteContentState, saveSiteData } from "@/lib/site-data-store";

export const runtime = "nodejs";

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
    const state = await getSiteContentState();
    const maintenance = (state.data as any)?.websiteControl?.maintenanceMode;
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
    const state = await getSiteContentState("mongodb");
    const json = state.data as any;

    const next = await saveSiteData({
      ...json,
      websiteControl: {
        ...json.websiteControl,
        maintenanceMode: {
          ...json.websiteControl?.maintenanceMode,
          ...patch,
        },
      },
      updatedAt: new Date().toISOString(),
    });

    return response(true, "Maintenance settings saved", {
      maintenanceMode: next.data.websiteControl.maintenanceMode,
    });
  } catch (error) {
    return response(false, "Failed to save maintenance settings", null, error instanceof Error ? error.message : "Failed", 500);
  }
}
