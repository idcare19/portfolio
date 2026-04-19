import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true as const, session };
}
