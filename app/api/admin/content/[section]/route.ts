import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/api/admin/site-data", request.url), 307);
}

export async function PUT(request: Request) {
  return NextResponse.redirect(new URL("/api/admin/site-data/update", request.url), 307);
}
