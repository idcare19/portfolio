import "server-only";

import { readGitHubJsonFile, updateGitHubJsonFile } from "@/lib/github-content";
import { readLocalSiteData } from "@/lib/local-site-data";
import { getPortfolioSiteData, savePortfolioSiteData } from "@/lib/portfolio/repository";
import { revalidateSitePaths } from "@/lib/site-revalidation";
import { normalizeSiteData, summarizeSectionCounts } from "@/lib/site-data-transform";
import type { SiteData } from "@/src/types/site-data";

const AUTO_SYNC_COMMIT_MESSAGE = "auto-sync: portfolio content updated";

export type DataSourceMode = "mongodb" | "github" | "auto";
export type ResolvedContentSource = "mongodb" | "github";

export type SiteContentState = {
  data: SiteData;
  requestedSource: DataSourceMode;
  activeSource: ResolvedContentSource;
  fallbackActivated: boolean;
  lastMongoUpdateAt: string | null;
  lastGitHubSyncAt: string | null;
};

export const DEFAULT_REVALIDATE_PATHS = ["/", "/projects", "/blogs", "/github", "/resume", "/maintenance"];

function logSync(message: string, details?: Record<string, unknown>) {
  void message;
  void details;
}

function applySyncStatus(
  data: SiteData,
  meta?: {
    lastMongoUpdateAt?: string;
    lastGitHubSyncAt?: string;
  }
) {
  return normalizeSiteData({
    ...data,
    websiteControl: {
      ...data.websiteControl,
      dataSource: data.websiteControl?.dataSource || "auto",
      syncStatus: {
        lastMongoUpdate: meta?.lastMongoUpdateAt || data.websiteControl?.syncStatus?.lastMongoUpdate || data.updatedAt,
        lastGitHubSync: meta?.lastGitHubSyncAt || data.websiteControl?.syncStatus?.lastGitHubSync || "",
      },
    },
  });
}

async function readMongoState(): Promise<SiteContentState> {
  const data = await getPortfolioSiteData();
  const normalized = applySyncStatus(data, {
    lastMongoUpdateAt: data.updatedAt,
    lastGitHubSyncAt: data.websiteControl?.syncStatus?.lastGitHubSync || "",
  });
  return {
    data: normalized,
    requestedSource: normalized.websiteControl?.dataSource || "auto",
    activeSource: "mongodb",
    fallbackActivated: false,
    lastMongoUpdateAt: normalized.websiteControl?.syncStatus?.lastMongoUpdate || normalized.updatedAt || null,
    lastGitHubSyncAt: normalized.websiteControl?.syncStatus?.lastGitHubSync || null,
  };
}

async function readGitHubState(): Promise<SiteContentState> {
  const file = await readGitHubJsonFile();
  const normalized = applySyncStatus(file.json as SiteData, {
    lastGitHubSyncAt: (file.json as SiteData)?.websiteControl?.syncStatus?.lastGitHubSync || (file.json as SiteData)?.updatedAt,
  });

  return {
    data: normalized,
    requestedSource: normalized.websiteControl?.dataSource || "auto",
    activeSource: "github",
    fallbackActivated: false,
    lastMongoUpdateAt: normalized.websiteControl?.syncStatus?.lastMongoUpdate || null,
    lastGitHubSyncAt: normalized.websiteControl?.syncStatus?.lastGitHubSync || normalized.updatedAt || null,
  };
}

async function readLocalFallbackState(): Promise<SiteContentState> {
  const local = applySyncStatus((await readLocalSiteData()) as SiteData);
  return {
    data: local,
    requestedSource: local.websiteControl?.dataSource || "auto",
    activeSource: "github",
    fallbackActivated: true,
    lastMongoUpdateAt: local.websiteControl?.syncStatus?.lastMongoUpdate || null,
    lastGitHubSyncAt: local.websiteControl?.syncStatus?.lastGitHubSync || null,
  };
}

async function persistMongo(
  data: SiteData,
  meta?: {
    lastMongoUpdateAt?: string;
    lastGitHubSyncAt?: string;
  }
): Promise<SiteContentState> {
  const normalized = applySyncStatus(
    {
      ...data,
      updatedAt: data.updatedAt || new Date().toISOString(),
    },
    meta
  );

  const saved = await savePortfolioSiteData(normalized);
  const finalData = applySyncStatus(saved, meta);

  return {
    data: finalData,
    requestedSource: finalData.websiteControl?.dataSource || "auto",
    activeSource: "mongodb",
    fallbackActivated: false,
    lastMongoUpdateAt: meta?.lastMongoUpdateAt || finalData.updatedAt,
    lastGitHubSyncAt: meta?.lastGitHubSyncAt || finalData.websiteControl?.syncStatus?.lastGitHubSync || null,
  };
}

async function backupMongoToGitHub(data: SiteData) {
  const syncTime = new Date().toISOString();
  const syncPayload = applySyncStatus(
    {
      ...data,
      updatedAt: data.updatedAt || syncTime,
    },
    {
      lastMongoUpdateAt: data.websiteControl?.syncStatus?.lastMongoUpdate || data.updatedAt || syncTime,
      lastGitHubSyncAt: syncTime,
    }
  );

  const githubResult = await updateGitHubJsonFile({
    data: syncPayload,
    message: AUTO_SYNC_COMMIT_MESSAGE,
  });

  logSync("[SYNC] MongoDB -> GitHub success", {
    commitSha: githubResult.commit.sha,
    path: githubResult.path,
    branch: githubResult.branch,
  });

  return {
    syncTime,
    githubResult,
    data: syncPayload,
  };
}

export async function getSiteContentState(preferredSource?: DataSourceMode): Promise<SiteContentState> {
  const requestedSource = preferredSource || "auto";

  if (requestedSource === "github") {
    try {
      const githubState = await readGitHubState();
      return { ...githubState, requestedSource };
    } catch (githubError) {
      try {
        logSync("[SYNC] Fallback activated", { from: "github", to: "mongodb" });
        const mongoState = await readMongoState();
        return { ...mongoState, requestedSource, fallbackActivated: true };
      } catch {
        throw githubError;
      }
    }
  }

  if (requestedSource === "mongodb") {
    try {
      const mongoState = await readMongoState();
      return { ...mongoState, requestedSource };
    } catch (mongoError) {
      try {
        logSync("[SYNC] Fallback activated", { from: "mongodb", to: "github" });
        const githubState = await readGitHubState();
        return { ...githubState, requestedSource, fallbackActivated: true };
      } catch {
        throw mongoError;
      }
    }
  }

  try {
    const mongoState = await readMongoState();
    return { ...mongoState, requestedSource };
  } catch (mongoError) {
    const hasGitHubConfig = !!(process.env.GITHUB_TOKEN || process.env.GITHUB_PAT);
    if (hasGitHubConfig) {
      try {
        logSync("[SYNC] Fallback activated", { from: "mongodb", to: "github", mode: "auto" });
        const githubState = await readGitHubState();
        return { ...githubState, requestedSource, fallbackActivated: true };
      } catch {
        console.error("[site-data-store] Remote GitHub fallback failed, using local JSON snapshot", {
          message: mongoError instanceof Error ? mongoError.message : "Unknown MongoDB read error",
        });
      }
    } else {
      console.warn("[site-data-store] GitHub fallback skipped (missing GITHUB_TOKEN), using local JSON snapshot");
    }

    const localState = await readLocalFallbackState();
    return { ...localState, requestedSource };
  }
}

export async function getOrSeedSiteData(): Promise<SiteData> {
  const state = await getSiteContentState();
  return state.data;
}

export async function saveSiteData(nextData: SiteData) {
  const now = new Date().toISOString();
  const requestedSource = nextData.websiteControl?.dataSource || "auto";
  const normalized = applySyncStatus(
    {
      ...nextData,
      updatedAt: now,
    },
    {
      lastMongoUpdateAt: now,
      lastGitHubSyncAt: nextData.websiteControl?.syncStatus?.lastGitHubSync || "",
    }
  );
  const mongoState = await persistMongo(normalized, {
    lastMongoUpdateAt: now,
    lastGitHubSyncAt: normalized.websiteControl?.syncStatus?.lastGitHubSync || "",
  });
  try {
    const backup = await backupMongoToGitHub(mongoState.data);
    const withSyncMeta = await persistMongo(
      {
        ...mongoState.data,
        websiteControl: {
          ...mongoState.data.websiteControl,
          dataSource: requestedSource,
          syncStatus: {
            ...mongoState.data.websiteControl?.syncStatus,
            lastMongoUpdate: now,
            lastGitHubSync: backup.syncTime,
          },
        },
      },
      {
        lastMongoUpdateAt: now,
        lastGitHubSyncAt: backup.syncTime,
      }
    );

    revalidateSitePaths(DEFAULT_REVALIDATE_PATHS);
    logSync("[SYNC] Revalidation completed", { paths: DEFAULT_REVALIDATE_PATHS });
    return withSyncMeta;
  } catch (error) {
    console.error("[site-data-store] GitHub backup failed after MongoDB save", {
      message: error instanceof Error ? error.message : "Unknown GitHub sync error",
    });
    revalidateSitePaths(DEFAULT_REVALIDATE_PATHS);
    logSync("[SYNC] Revalidation completed", { paths: DEFAULT_REVALIDATE_PATHS });
    return {
      ...mongoState,
      requestedSource,
    };
  }
}

export async function syncGitHubToMongo() {
  const githubState = await readGitHubState();
  const now = new Date().toISOString();
  const persisted = await persistMongo(
    {
      ...githubState.data,
      updatedAt: now,
      websiteControl: {
        ...githubState.data.websiteControl,
        syncStatus: {
          ...githubState.data.websiteControl?.syncStatus,
          lastMongoUpdate: now,
          lastGitHubSync: githubState.lastGitHubSyncAt || now,
        },
      },
    },
    {
      lastMongoUpdateAt: now,
      lastGitHubSyncAt: githubState.lastGitHubSyncAt || now,
    }
  );

  revalidateSitePaths(DEFAULT_REVALIDATE_PATHS);
  logSync("[SYNC] GitHub -> MongoDB success");
  logSync("[SYNC] Revalidation completed", { paths: DEFAULT_REVALIDATE_PATHS });
  return persisted;
}

export async function syncMongoToGitHub() {
  const mongoState = await getSiteContentState("mongodb");
  const backup = await backupMongoToGitHub(mongoState.data);
  const persisted = await persistMongo(
    {
      ...mongoState.data,
      websiteControl: {
        ...mongoState.data.websiteControl,
        syncStatus: {
          ...mongoState.data.websiteControl?.syncStatus,
          lastGitHubSync: backup.syncTime,
        },
      },
    },
    {
      lastMongoUpdateAt: mongoState.lastMongoUpdateAt || mongoState.data.updatedAt,
      lastGitHubSyncAt: backup.syncTime,
    }
  );

  revalidateSitePaths(DEFAULT_REVALIDATE_PATHS);
  logSync("[SYNC] Revalidation completed", { paths: DEFAULT_REVALIDATE_PATHS });
  return {
    ...persisted,
    github: backup.githubResult,
  };
}
