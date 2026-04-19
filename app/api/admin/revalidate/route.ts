import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/server";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json().catch(() => ({}));
    const paths = Array.isArray(body?.paths) ? body.paths.filter((v: unknown) => typeof v === "string" && v.startsWith("/")) : ["/"];

    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      success: true,
      ok: true,
      message: "Revalidation complete",
      data: { paths },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        message: "Revalidation failed",
        data: null,
        error: error instanceof Error ? error.message : "Failed",
      },
      { status: 500 }
    );
  }
}
