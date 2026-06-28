import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { uploadGitHubBinaryFile } from "@/lib/github-content";

export const runtime = "nodejs";

function normalizeFileName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || `image-${Date.now()}.png`;
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowed = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"]);
    if (!allowed.has(ext)) {
      return NextResponse.json({ ok: false, error: "Unsupported image type" }, { status: 400 });
    }

    const targetDir = "public/projects";
    const timestamp = Date.now();
    const safeName = normalizeFileName(file.name);
    const targetPath = `${targetDir}/${timestamp}-${safeName}`;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await uploadGitHubBinaryFile({
      path: targetPath,
      bytes,
      message: `chore: upload image ${safeName} to ${targetDir}`,
    });

    return NextResponse.json({
      ok: true,
      commitSha: result.commit.sha,
      fileSha: result.content.sha,
      path: targetPath,
      publicUrl: `/${targetPath.replace(/^public\//, "")}`,
      name: safeName,
      size: file.size,
      type: file.type || "image",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Image upload failed" },
      { status: 500 }
    );
  }
}
