import { NextResponse } from "next/server";
import { getPortfolioData } from "@/data/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(
    {
      ok: true,
      updatedAt: new Date().toISOString(),
      data,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
