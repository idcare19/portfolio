import { NextResponse } from "next/server";
import { searchPortfolio } from "@/lib/search";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const results = await searchPortfolio(query);
  return NextResponse.json({ ok: true, results });
}
