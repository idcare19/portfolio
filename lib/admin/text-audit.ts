import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { getOrSeedSiteData } from "@/lib/site-data-store";
import type { DynamicSectionId, SiteData } from "@/src/types/site-data";

type AuditItem = {
  componentName: string;
  filePath: string;
  sectionId: DynamicSectionId;
  literal: string;
  suggestedKey: string;
  status: "fixed" | "dynamic";
  category: "buttons" | "labels" | "navigation" | "footer" | "errors" | "success" | "github" | "portfolio-ai" | "content";
  pathHint: string;
};

type AuditSummary = {
  filesScanned: number;
  textsFound: number;
  managedCount: number;
  ignoredStrings: number;
  duplicatesRemoved: number;
  coverage: number;
};

const AUDIT_TARGETS: Array<{ sectionId: DynamicSectionId; filePath: string }> = [
  { sectionId: "hero", filePath: "components/sections/HeroSection.tsx" },
  { sectionId: "about", filePath: "components/sections/AboutSection.tsx" },
  { sectionId: "skills", filePath: "components/sections/SkillsSection.tsx" },
  { sectionId: "projects", filePath: "components/sections/ProjectsSection.tsx" },
  { sectionId: "working", filePath: "components/sections/WorkingProjectsSection.tsx" },
  { sectionId: "completed", filePath: "components/sections/CompletedProjectsSection.tsx" },
  { sectionId: "reviews", filePath: "components/sections/ReviewsSection.tsx" },
  { sectionId: "journey", filePath: "components/sections/JourneySection.tsx" },
  { sectionId: "services", filePath: "components/sections/ServicesSection.tsx" },
  { sectionId: "contact", filePath: "components/sections/ContactSection.tsx" },
  { sectionId: "footer", filePath: "components/layout/FooterSection.tsx" },
  { sectionId: "hero", filePath: "components/layout/Navbar.tsx" },
  { sectionId: "contact", filePath: "components/layout/FooterSection.tsx" },
  { sectionId: "projects", filePath: "app/projects/page.tsx" },
  { sectionId: "projects", filePath: "app/projects/[slug]/page.tsx" },
  { sectionId: "blogs", filePath: "app/blogs/page.tsx" },
  { sectionId: "blogs", filePath: "app/blogs/[slug]/page.tsx" },
  { sectionId: "hero", filePath: "app/resume/page.tsx" },
];

const STRING_LITERAL_PATTERN = /(?<![A-Za-z0-9_])["'`]([^"'`\n]*[A-Za-z][^"'`\n]*)["'`]/g;
const JSX_TEXT_PATTERN = />([^<>{}\n]{3,})</g;
const TEXT_PROP_PATTERN = /\b(?:aria-label|title|placeholder|alt|label|text|description|message|toast|tooltip|helperText|buttonLabel|navLabel|ctaLabel|footerText|copyrightText)\s*=\s*["'`]([^"'`\n]*[A-Za-z][^"'`\n]*)["'`]/g;
const IGNORE_LITERALS = new Set([
  "use client",
  "server-only",
  "hero",
  "about",
  "skills",
  "projects",
  "working",
  "completed",
  "reviews",
  "journey",
  "services",
  "contact",
  "blogs",
  "github",
]);

const CATEGORY_RULES: Array<{ category: AuditItem["category"]; test: (literal: string, filePath: string) => boolean }> = [
  { category: "buttons", test: (literal) => /\b(button|cta|view|save|open|submit|delete|add|create|move|preview|edit|cancel|close|send|talk|learn more)\b/i.test(literal) },
  { category: "labels", test: (literal) => /\b(label|name|title|heading|subtitle|description|placeholder|helper|email|github|linkedin|instagram|twitter)\b/i.test(literal) },
  { category: "navigation", test: (literal, filePath) => filePath.includes("Navbar") || /\b(home|about|skills|projects|contact|resume|blogs|github)\b/i.test(literal) },
  { category: "footer", test: (literal, filePath) => filePath.includes("Footer") || /\b(footer|copyright|back to top|quick links|let's talk)\b/i.test(literal) },
  { category: "errors", test: (literal) => /\b(error|failed|invalid|unauthorized|not found|missing)\b/i.test(literal) },
  { category: "success", test: (literal) => /\b(success|saved|updated|created|deleted|synced|completed)\b/i.test(literal) },
  { category: "github", test: (literal) => /\b(github|repo|repository|commits|stars|followers|forks|activity)\b/i.test(literal) },
  { category: "portfolio-ai", test: (literal) => /\b(ai|gemini|assistant|retrieval|portfolio ai)\b/i.test(literal) },
];
function slugifyKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "text";
}

function looksUserFacing(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.length < 3) return false;
  if (trimmed.startsWith("@/")) return false;
  if (trimmed.includes("className")) return false;
  // Ignore Tailwind/CSS classes
  if (/^(bg-|text-|border-|p-|px-|py-|m-|mx-|my-|flex|grid|block|hidden|rounded|shadow|transition|hover:|focus:|md:|lg:|xl:)/.test(trimmed)) return false;
  // Ignore CSS variables
  if (trimmed.includes("rgb(var(--") || trimmed.includes("--")) return false;
  // Ignore route patterns with template literals
  if (trimmed.includes("${")) return false;
  // Ignore URLs
  if (trimmed.includes("http://") || trimmed.includes("https://") || trimmed.includes("mailto:")) return false;
  // Ignore import paths, file paths, props
  if (/^[A-Z0-9_\-/.]+$/.test(trimmed)) return false;
  if (/^[a-z0-9-_/.[\]]+$/.test(trimmed)) return false;
  // Ignore icon names from lucide-react
  if (["Github", "Linkedin", "Mail", "ChevronUp", "Trash2", "Plus", "Copy", "GripVertical"].includes(trimmed)) return false;
  if (IGNORE_LITERALS.has(trimmed)) return false;
  // Must contain at least two words or a proper sentence to be considered visible text
  return /[A-Za-z]{2,}/.test(trimmed) && (/\s/.test(trimmed) || /^[A-Z][a-z]+$/.test(trimmed));
}

function looksLikeCodeNoise(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (/^[_A-Za-z][A-Za-z0-9_.$,()<>[\]{}:+\-*/=&|!?\\ ]*$/.test(trimmed) && !/\s/.test(trimmed)) return true;
  if (/^(bg|text|border|from|to|via|shadow|ring|opacity|rounded|px|py|mx|my|gap|grid|flex|items|justify|hover|focus|sm|md|lg|xl):/.test(trimmed)) return true;
  if (/^(className|style|href|id|key|renderer|sectionId|target|rel|svg|svgPath|path|file|folder|import|export|function|component|interface|type|const|let|var)\b/.test(trimmed)) return true;
  return false;
}

function getComponentName(filePath: string) {
  return path.basename(filePath);
}

function getSectionKeys(siteData: SiteData, sectionId: DynamicSectionId) {
  return new Set((siteData.sections?.[sectionId]?.textBlocks || []).map((block) => block.key));
}

export async function runTextAudit() {
  const siteData = await getOrSeedSiteData();
  const workspaceRoot = process.cwd();
  const results: AuditItem[] = [];
  let filesScanned = 0;
  let textsFound = 0;
  let ignoredStrings = 0;

  for (const target of AUDIT_TARGETS) {
    const absolutePath = path.join(workspaceRoot, target.filePath);
    const source = await readFile(absolutePath, "utf8");
    filesScanned += 1;
    const currentKeys = getSectionKeys(siteData, target.sectionId);
    const matches = [...source.matchAll(JSX_TEXT_PATTERN), ...source.matchAll(TEXT_PROP_PATTERN), ...source.matchAll(STRING_LITERAL_PATTERN)];
    const seenInFile = new Set<string>();

    for (const match of matches) {
      const literal = match[1]?.trim();
      if (!literal) continue;
      if (seenInFile.has(literal)) {
        ignoredStrings += 1;
        continue;
      }
      seenInFile.add(literal);

      if (looksLikeCodeNoise(literal) || !looksUserFacing(literal)) {
        ignoredStrings += 1;
        continue;
      }

      textsFound += 1;
      const category =
        CATEGORY_RULES.find((rule) => rule.test(literal, target.filePath))?.category || "content";
      const suggestedKey = `${target.sectionId}.${slugifyKey(literal)}`;
      results.push({
        componentName: getComponentName(target.filePath),
        filePath: target.filePath,
        sectionId: target.sectionId,
        literal,
        suggestedKey,
        status: currentKeys.has(suggestedKey) ? "dynamic" : "fixed",
        category,
        pathHint: `${target.filePath}:${match.index || 0}`,
      });
    }
  }

  const deduped = Array.from(new Map(results.map((item) => [`${item.filePath}:${item.literal}`, item])).values());
  const duplicatesRemoved = results.length - deduped.length;
  const managedCount = deduped.filter((item) => item.status === "dynamic").length;
  const coverage = deduped.length === 0 ? 100 : Math.max(0, Math.min(100, Math.round((managedCount / deduped.length) * 100)));

  return {
    items: deduped,
    summary: {
      filesScanned,
      textsFound,
      ignoredStrings,
      duplicatesRemoved,
      coverage,
      managedCount,
    } satisfies AuditSummary,
  };
}