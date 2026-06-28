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

export async function authorizeSiteDataWrite(request: Request) {
  const secret = process.env.ADMIN_SECRET;
  const headerSecret = request.headers.get("x-admin-secret");

  if (secret && headerSecret && secret === headerSecret) {
    return { ok: true as const, mode: "secret" as const };
  }

  const session = await getAdminSession();
  if (session) {
    return { ok: true as const, mode: "session" as const, session };
  }

  return {
    ok: false as const,
    response: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
  };
}
