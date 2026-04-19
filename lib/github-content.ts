import { Buffer } from "node:buffer";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_CONTENT_PATH = process.env.GITHUB_CONTENT_PATH || "src/data/siteData.json";

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

function assertEnv() {
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    throw new Error("Missing GitHub configuration env vars");
  }
}

function githubUrl(path: string) {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
}

function githubHeaders(extra?: HeadersInit) {
  return {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
    ...(extra || {}),
  };
}

async function githubRequest<T>(url: string, init?: RequestInit): Promise<T> {
  assertEnv();
  const res = await fetch(url, {
    ...init,
    headers: githubHeaders(init?.headers),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${text}`);
  }

  return (await res.json()) as T;
}

export async function readGitHubJsonFile(path = GITHUB_CONTENT_PATH) {
  const url = `${githubUrl(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
  const payload = await githubRequest<GitHubContentResponse>(url, { method: "GET" });
  const decoded = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8");
  return {
    sha: payload.sha,
    json: JSON.parse(decoded),
  };
}

export async function updateGitHubJsonFile({
  data,
  message,
  path = GITHUB_CONTENT_PATH,
}: {
  data: unknown;
  message: string;
  path?: string;
}) {
  const current = await readGitHubJsonFile(path);
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf8").toString("base64");

  const body = {
    message,
    content,
    sha: current.sha,
    branch: GITHUB_BRANCH,
  };

  const response = await githubRequest<{ content: { sha: string }; commit: { sha: string } }>(githubUrl(path), {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return response;
}

async function getGitHubFileSha(path: string): Promise<string | undefined> {
  assertEnv();
  const url = `${githubUrl(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: githubHeaders(),
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
}: {
  path: string;
  bytes: Uint8Array;
  message: string;
}) {
  const existingSha = await getGitHubFileSha(path);
  const content = Buffer.from(bytes).toString("base64");

  const body = {
    message,
    content,
    ...(existingSha ? { sha: existingSha } : {}),
    branch: GITHUB_BRANCH,
  };

  const response = await githubRequest<{ content: { sha: string; path: string }; commit: { sha: string } }>(githubUrl(path), {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return response;
}

export async function listGitHubDirectory(path: string) {
  const url = `${githubUrl(path)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
  const entries = await githubRequest<GitHubDirectoryEntry[]>(url, { method: "GET" });
  return entries;
}
