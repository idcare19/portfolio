import "server-only";

import { connectToDatabase } from "@/lib/mongodb";
import { Message } from "@/models/Message";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_EMAIL = 3;
const MAX_REQUESTS_PER_IP = 8;

function getWindowStartIso() {
  return new Date(Date.now() - WINDOW_MS).toISOString();
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

export function sanitizeContactInput(value: string, maxLength: number) {
  return value.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, maxLength);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function enforceContactRateLimit(input: { email: string; ip: string }) {
  await connectToDatabase();
  const threshold = getWindowStartIso();

  const [emailCount, ipCount] = await Promise.all([
    Message.countDocuments({ email: input.email, createdAt: { $gte: threshold } }),
    Message.countDocuments({ ipAddress: input.ip, createdAt: { $gte: threshold } }),
  ]);

  if (emailCount >= MAX_REQUESTS_PER_EMAIL || ipCount >= MAX_REQUESTS_PER_IP) {
    throw new Error("Too many contact requests. Please try again later.");
  }
}
