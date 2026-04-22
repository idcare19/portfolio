import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const LOCAL_SITE_DATA_PATH = resolve(process.cwd(), "src", "data", "siteData.json");

export async function writeLocalSiteData(data: unknown) {
  try {
    await mkdir(dirname(LOCAL_SITE_DATA_PATH), { recursive: true });
    await writeFile(LOCAL_SITE_DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Failed to write local site data",
    };
  }
}

