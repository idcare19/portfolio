import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/server";

export async function POST() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return NextResponse.json({
    success: true,
    ok: true,
    message: "Cache clear request completed",
    data: { revalidated: ["/", "/admin"] },
    error: null,
  });
}
