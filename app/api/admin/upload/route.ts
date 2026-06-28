import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "File is required" }, { status: 400 });
    }

    const uploaded = await uploadToCloudinary(file);
    return NextResponse.json({
      ok: true,
      url: uploaded.secureUrl,
      name: uploaded.originalFilename,
      size: uploaded.bytes,
      type: uploaded.format,
      publicId: uploaded.publicId,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
