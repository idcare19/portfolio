import { Buffer } from "node:buffer";

const DEFAULT_GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DEFAULT_GITHUB_OWNER = process.env.GITHUB_OWNER;
const DEFAULT_GITHUB_REPO = process.env.GITHUB_REPO;
const DEFAULT_GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const DEFAULT_GITHUB_CONTENT_PATH = process.env.GITHUB_CONTENT_PATH || "src/data/siteData.json";

export type GitHubProjectConfig = {
  token?: string;
  owner: string;
  repo: string;
  branch?: string;
  contentPath?: string;
};

type GitHubContentResponse = {
  sha: string;
  content: string;
};

type GitHubDirectoryEntry = {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  download_url: string | null;
};

function resolveConfig(config?: Partial<GitHubProjectConfig>) {
  const normalizedContentPath = (config?.contentPath || DEFAULT_GITHUB_CONTENT_PATH || "src/data/siteData.json")
    .trim()
    .replace(/^\/+/, "");

  return {
    token: config?.token || DEFAULT_GITHUB_TOKEN,
    owner: config?.owner || DEFAULT_GITHUB_OWNER,
    repo: config?.repo || DEFAULT_GITHUB_REPO,
    branch: config?.branch || DEFAULT_GITHUB_BRANCH,
    contentPath: normalizedContentPath,
  };
}

function assertEnv(config?: Partial<GitHubProjectConfig>) {
  const resolved = resolveConfig(config);
  if (!resolved.token || !resolved.owner || !resolved.repo) {
    throw new Error("Missing GitHub configuration env vars");
  }

  return resolved;
}

function githubUrl(path: string, config?: Partial<GitHubProjectConfig>) {
  const resolved = assertEnv(config);
  return `https://api.github.com/repos/${resolved.owner}/${resolved.repo}/contents/${path}`;
}

function githubHeaders(config?: Partial<GitHubProjectConfig>, extra?: HeadersInit) {
  const resolved = assertEnv(config);
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${resolved.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(extra || {}),
  };
}

async function githubRequest<T>(url: string, config?: Partial<GitHubProjectConfig>, init?: RequestInit): Promise<T> {
  assertEnv(config);
  const res = await fetch(url, {
    ...init,
    headers: githubHeaders(config, init?.headers),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    const details = text || "No response body";

    if (res.status === 403) {
      throw new Error(
        `GitHub API error (403): ${details}. Your token cannot access this action/resource. For Personal Access Tokens, ensure repository access includes ${assertEnv(config).owner}/${assertEnv(config).repo} and permissions include Contents: Read and write (plus Metadata: Read). Requested URL: ${url}`
      );
    }

    if (res.status === 404) {
      throw new Error(
        `GitHub API error (404): ${details}. Verify owner/repo/branch/contentPath and token access. Requested URL: ${url}`
      );
    }

    throw new Error(`GitHub API error (${res.status}): ${details}`);
  }

  return (await res.json()) as T;
}

export async function readGitHubJsonFile(path?: string, projectConfig?: Partial<GitHubProjectConfig>) {
  const resolved = assertEnv(projectConfig);
  const contentPath = path || resolved.contentPath;
  const url = `${githubUrl(contentPath, projectConfig)}?ref=${encodeURIComponent(resolved.branch)}`;
  const payload = await githubRequest<GitHubContentResponse>(url, projectConfig, { method: "GET" });
  const decoded = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8");
  return {
    sha: payload.sha,
    json: JSON.parse(decoded),
  };
}

export async function updateGitHubJsonFile({
  data,
  message,
  path,
  projectConfig,
}: {
  data: unknown;
  message: string;
  path?: string;
  projectConfig?: Partial<GitHubProjectConfig>;
}) {
  const resolved = assertEnv(projectConfig);
  const contentPath = path || resolved.contentPath;
  const current = await readGitHubJsonFile(contentPath, projectConfig);
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");

  const body = {
    message,
    content,
    sha: current.sha,
    branch: resolved.branch,
  };

  const response = await githubRequest<{ content: { sha: string }; commit: { sha: string } }>(githubUrl(contentPath, projectConfig), projectConfig, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return response;
}

async function getGitHubFileSha(path: string, projectConfig?: Partial<GitHubProjectConfig>): Promise<string | undefined> {
  const resolved = assertEnv(projectConfig);
  const url = `${githubUrl(path, projectConfig)}?ref=${encodeURIComponent(resolved.branch)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: githubHeaders(projectConfig),
    cache: "no-store",
  });

  if (res.status === 404) return undefined;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${text}`);
  }

  const payload = (await res.json()) as GitHubContentResponse;
  return payload.sha;
}

export async function uploadGitHubBinaryFile({
  path,
  bytes,
  message,
  projectConfig,
}: {
  path: string;
  bytes: Uint8Array;
  message: string;
  projectConfig?: Partial<GitHubProjectConfig>;
}) {
  const resolved = assertEnv(projectConfig);
  const existingSha = await getGitHubFileSha(path, projectConfig);
  const content = Buffer.from(bytes).toString("base64");

  const body = {
    message,
    content,
    ...(existingSha ? { sha: existingSha } : {}),
    branch: resolved.branch,
  };

  const response = await githubRequest<{ content: { sha: string; path: string }; commit: { sha: string } }>(githubUrl(path, projectConfig), projectConfig, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return response;
}

export async function listGitHubDirectory(path: string, projectConfig?: Partial<GitHubProjectConfig>) {
  const resolved = assertEnv(projectConfig);
  const url = `${githubUrl(path, projectConfig)}?ref=${encodeURIComponent(resolved.branch)}`;
  const entries = await githubRequest<GitHubDirectoryEntry[]>(url, projectConfig, { method: "GET" });
  return entries;
}

export async function deleteGitHubFile({
  path,
  message,
  projectConfig,
}: {
  path: string;
  message: string;
  projectConfig?: Partial<GitHubProjectConfig>;
}) {
  const resolved = assertEnv(projectConfig);
  const sha = await getGitHubFileSha(path, projectConfig);
  if (!sha) {
    throw new Error(`File not found in repository: ${path}`);
  }

  const response = await githubRequest<{ commit: { sha: string } }>(githubUrl(path, projectConfig), projectConfig, {
    method: "DELETE",
    body: JSON.stringify({
      message,
      sha,
      branch: resolved.branch,
    }),
  });

  return response;
}
