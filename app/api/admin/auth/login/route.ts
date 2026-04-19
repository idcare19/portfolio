import { NextResponse } from "next/server";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body?.email || "").trim();
  const password = String(body?.password || "");

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  await setAdminSession(email);
  return NextResponse.json({ ok: true });
}
