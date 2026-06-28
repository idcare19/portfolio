import "server-only";

import { createHash } from "crypto";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary credentials");
  }

  return { cloudName, apiKey, apiSecret };
}

function signUpload(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export async function uploadToCloudinary(file: File) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "portfolio";
  const signature = signUpload({ folder, timestamp }, apiSecret);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok || !payload) {
    throw new Error(String(payload?.error || "Cloudinary upload failed"));
  }

  return {
    publicId: String(payload.public_id || ""),
    secureUrl: String(payload.secure_url || ""),
    originalFilename: String(payload.original_filename || file.name),
    bytes: Number(payload.bytes || file.size || 0),
    format: String(payload.format || file.type || "image"),
  };
}
