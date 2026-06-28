import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { Section } from "@/models/Section";
import { SiteSettings } from "@/models/SiteSettings";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    await connectToDatabase();
    const [siteSettingsCount, sectionCount, siteSettingsDocs, sectionDocs, readData] = await Promise.all([
      SiteSettings.countDocuments({}),
      Section.countDocuments({}),
      SiteSettings.find({}, { _id: 1, key: 1, updatedAt: 1 }).lean(),
      Section.find({}, { _id: 1, key: 1, id: 1, updatedAt: 1, items: 1 }).lean(),
      getPortfolioSiteData(),
    ]);
    const aboutSection = sectionDocs.find((section: any) => section.key === "about" || section.id === "about") || null;
    const siteSettings = siteSettingsDocs[0] || null;

    return NextResponse.json({
      siteSettingsCount,
      sectionCount,
      aboutSection,
      siteSettings,
      saveCollection: "SiteSettings",
      readCollection: "Section",
      savedDocumentUpdatedAt: readData.updatedAt || null,
      readDocumentUpdatedAt: aboutSection?.updatedAt || null,
      saveAboutItems: readData.sections?.about?.items || [],
      readAboutItems: aboutSection?.items || [],
      activeSource: "mongodb",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load storage debug data",
      },
      { status: 500 }
    );
  }
}
