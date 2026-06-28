import "server-only";

<<<<<<< HEAD
import { GoogleGenAI } from "@google/genai";
import { buildPublicCorpus, rankPublicCorpus, type PublicCorpusEntry } from "@/lib/public-corpus";
import { getFullSiteData } from "@/src/lib/site-data";

type AssistantTurn = {
  question: string;
  answer: string;
};

type AssistantSource = {
  source: string;
  href: string;
  excerpt: string;
};

type AssistantResponse = {
  answer: string;
  confidence: number;
  sources: AssistantSource[];
  usedGemini: boolean;
};

type AssistantLog = {
  question: string;
  timestamp: string;
  usedGemini: boolean;
  success: boolean;
  reason: string;
};

const GEMINI_TIMEOUT_MS = 9000;
const RESPONSE_CACHE_TTL_MS = 1000 * 60 * 10;
const assistantCache = new Map<string, { expiresAt: number; value: AssistantResponse }>();
const assistantLogs: AssistantLog[] = [];

function logAssistantEvent(entry: AssistantLog) {
  assistantLogs.unshift(entry);
  if (assistantLogs.length > 30) {
    assistantLogs.length = 30;
  }
}

export function getAssistantRuntimeStatus() {
  return {
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    cacheEntries: assistantCache.size,
    logs: assistantLogs,
  };
}

function buildQuery(question: string, history: AssistantTurn[]) {
  const recent = history.slice(-3).map((turn) => `${turn.question} ${turn.answer}`).join(" ");
  return `${question} ${recent}`.trim();
}

function dedupeByHref<T extends { href: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

function detectPreferredTypes(question: string) {
  const q = question.toLowerCase();
  const preferred = new Set<string>();

  if (/service|offer|help/i.test(q)) preferred.add("service");
  if (/project|work|build/i.test(q)) preferred.add("project");
  if (/blog|article|post|write/i.test(q)) preferred.add("blog");
  if (/skill|stack|technology|tech/i.test(q)) preferred.add("skill");
  if (/experience|journey|role|career/i.test(q)) preferred.add("experience");
  if (/review|testimonial|client/i.test(q)) preferred.add("testimonial");
  if (/contact|email|linkedin|github profile|reach/i.test(q)) preferred.add("contact");
  if (/github|repo|repository|commit|contribution|activity|star|fork/i.test(q)) {
    preferred.add("github-repo");
    preferred.add("github-commit");
    preferred.add("github-activity");
    preferred.add("contact");
  }

  return preferred;
}

function rankAssistantMatches(question: string, entries: PublicCorpusEntry[]) {
  const preferredTypes = detectPreferredTypes(question);
  const rankedMatches = rankPublicCorpus(question, entries, 18);
  const sortedMatches =
    preferredTypes.size > 0
      ? [
          ...rankedMatches.filter((entry) => preferredTypes.has(entry.type)),
          ...rankedMatches.filter((entry) => !preferredTypes.has(entry.type)),
        ]
      : rankedMatches;

  return dedupeByHref(sortedMatches);
}

function toSources(entries: Array<PublicCorpusEntry & { score: number }>) {
  return entries.map((entry) => ({
    source: `${entry.type}: ${entry.title}`,
    href: entry.href,
    excerpt: entry.description,
  }));
}

function buildFallbackAnswer(question: string, entries: Array<PublicCorpusEntry & { score: number }>, githubStats: Awaited<ReturnType<typeof buildPublicCorpus>>["githubStats"]): AssistantResponse {
  if (!entries.length) {
    return {
      answer: "I couldn't find that information in the portfolio.",
      confidence: 0,
      sources: [],
      usedGemini: false,
    };
  }

  const answerLines = entries.slice(0, 3).map((entry) => {
    const excerpt = entry.content || entry.description;
    return `${entry.title}: ${excerpt.slice(0, 220).trim()}`;
  });

  if (githubStats && /github|repo|commit|contribution|activity/i.test(question)) {
    answerLines.unshift(
      `GitHub overview: ${githubStats.publicRepos} public repos, ${githubStats.totalCommits} recent commits tracked, ${githubStats.stars} stars, ${githubStats.forks} forks.`
    );
  }

  return {
    answer: answerLines.join("\n\n"),
    sources: toSources(entries.slice(0, 6)),
    confidence: Math.min(1, Math.max(...entries.map((entry) => entry.score)) / 100),
    usedGemini: false,
  };
}

function buildGeminiPrompt(question: string, history: AssistantTurn[], contextChunks: Array<PublicCorpusEntry & { score: number }>) {
  const systemPrompt = `You are Abhishek's Portfolio AI.

Answer ONLY using the supplied portfolio context.

Never invent information.

If something is unavailable, politely say you don't have that information.

Keep answers professional, concise, and natural.

Mention sources whenever possible.`;

  const contextBlock = contextChunks
    .map(
      (entry, index) =>
        `Source ${index + 1}
Type: ${entry.type}
Title: ${entry.title}
URL: ${entry.href}
Description: ${entry.description}
Content: ${entry.content}`
    )
    .join("\n\n");

  const historyBlock = history.length
    ? history
        .slice(-3)
        .map((turn, index) => `History ${index + 1}\nUser: ${turn.question}\nAssistant: ${turn.answer}`)
        .join("\n\n")
    : "No prior history.";

  return `${systemPrompt}

Conversation history:
${historyBlock}

Portfolio context:
${contextBlock}

User question:
${question}

Return a concise answer using only the context.`;
}

function normalizeGeminiText(value: string) {
  return value
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function generateGeminiAnswer(
  prompt: string,
  config: NonNullable<Awaited<ReturnType<typeof getFullSiteData>>["aiConfig"]>
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model: config.model,
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          temperature: config.temperature,
          maxOutputTokens: config.maxTokens,
        },
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Gemini request timed out.")), GEMINI_TIMEOUT_MS);
      }),
    ]);

    const text = normalizeGeminiText(response.text || "");
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (error) {
    throw error;
  }
}

function inferConfidenceFromMatches(matches: Array<PublicCorpusEntry & { score: number }>, floor: number) {
  const bestScore = Math.max(0, ...matches.map((entry) => entry.score));
  return Math.max(floor, Math.min(1, bestScore / 100));
}

export async function answerPortfolioQuestion(question: string, history: AssistantTurn[] = []): Promise<AssistantResponse> {
  const siteData = await getFullSiteData();
  const aiConfig = siteData.aiConfig || {
    enabled: true,
    model: "gemini-2.5-flash",
    temperature: 0.2,
    maxTokens: 700,
    maxContextChunks: 6,
    confidenceThreshold: 0.2,
  };
  const query = buildQuery(question, history);
  const cacheKey = JSON.stringify({
    q: query,
    h: history.slice(-2),
    model: aiConfig.model,
    maxContextChunks: aiConfig.maxContextChunks,
  });
  const cached = assistantCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const { entries, githubStats } = await buildPublicCorpus();
  const matches = rankAssistantMatches(query, entries).slice(0, Math.max(1, aiConfig.maxContextChunks || 6));
  const fallbackResponse = buildFallbackAnswer(question, matches, githubStats);

  if (!matches.length) {
    logAssistantEvent({
      question,
      timestamp: new Date().toISOString(),
      usedGemini: false,
      success: true,
      reason: "no-context",
    });
    return fallbackResponse;
  }

  if (!aiConfig.enabled) {
    logAssistantEvent({
      question,
      timestamp: new Date().toISOString(),
      usedGemini: false,
      success: true,
      reason: "ai-disabled",
    });
    assistantCache.set(cacheKey, {
      expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
      value: fallbackResponse,
    });
    return fallbackResponse;
  }

  try {
    const prompt = buildGeminiPrompt(question, history, matches);
    const geminiAnswer = await generateGeminiAnswer(prompt, aiConfig);
    const response: AssistantResponse = {
      answer: geminiAnswer,
      confidence: inferConfidenceFromMatches(matches, aiConfig.confidenceThreshold || 0.2),
      sources: toSources(matches.slice(0, 6)),
      usedGemini: true,
    };

    assistantCache.set(cacheKey, {
      expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
      value: response,
    });
    logAssistantEvent({
      question,
      timestamp: new Date().toISOString(),
      usedGemini: true,
      success: true,
      reason: "gemini-success",
    });
    return response;
  } catch (error) {
    logAssistantEvent({
      question,
      timestamp: new Date().toISOString(),
      usedGemini: false,
      success: false,
      reason: error instanceof Error ? error.message : "gemini-fallback",
    });
    assistantCache.set(cacheKey, {
      expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS,
      value: fallbackResponse,
    });
    return fallbackResponse;
  }
}
=======
import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { scoreFuzzy } from "@/lib/content-utils";

export async function answerPortfolioQuestion(question: string) {
  // Block all private/admin/internal questions first
  const adminKeywords = ["admin", "sidebar", "draft", "hidden", "disabled", "env", "environment", "database", "mongo", "mongodb", "internal", "private", "secret", "id", "settings", "control panel", "cms"];
  const isAdminQuestion = adminKeywords.some(keyword => question.toLowerCase().includes(keyword));
  
  if (isAdminQuestion) {
    return {
      answer: "I can only answer questions based on the public portfolio content.",
      sources: [],
    };
  }

  const siteData = await getPortfolioSiteData();
  // Strictly only use PUBLIC content - filter out all non-public, draft, or disabled content
  const corpus = [
    ...siteData.projectsDetailed.map((project) => ({
      source: `Project: ${project.title}`,
      content: [project.shortDescription, project.longDescription, project.problem, project.solution, project.myRole, ...(project.features || [])].filter(Boolean).join(" "),
      href: `/projects/${project.slug || project.id}`,
    })),
    ...siteData.blogs
      .filter((blog) => blog.status === "published" && blog.isEnabled) // Only PUBLISHED, ENABLED blogs
      .map((blog) => ({
      source: `Blog: ${String(blog.title || "")}`,
      content: String(blog.excerpt || blog.content || ""),
      href: `/blogs/${blog.slug || ""}`,
      })),
    ...siteData.skillsDetailed.map((skill) => ({
      source: `Skill: ${skill.name}`,
      content: `${skill.name} ${skill.category}`,
      href: "#skills",
    })),
    ...siteData.experience.map((item) => ({
      source: `Experience: ${item.role}`,
      content: `${item.role} ${item.period} ${item.summary}`,
      href: "#journey",
    })),
    ...siteData.testimonialsDetailed.map((item) => ({
      source: `Testimonial: ${item.clientName}`,
      content: `${item.roleCompany} ${item.message}`,
      href: "#reviews",
    })),
  ];

  const matches = corpus
    .map((entry) => ({ ...entry, score: scoreFuzzy(question, `${entry.source} ${entry.content}`) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (!matches.length) {
    return {
      answer: "I could not find that in the portfolio data yet.",
      sources: [],
    };
  }

  return {
    answer: matches.map((entry) => `${entry.source}: ${entry.content.slice(0, 220)}`).join("\n\n"),
    sources: matches.map(({ source, href }) => ({ source, href })),
  };
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
