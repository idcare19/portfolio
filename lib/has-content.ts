export function hasContent(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.some((item) => hasContent(item));
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some((item) => hasContent(item));
  return Boolean(value);
}
