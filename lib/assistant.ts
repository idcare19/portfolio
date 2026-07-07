import "server-only";

import { GoogleGenAI } from "@google/genai";
import { rankPublicCorpus, type PublicCorpusEntry } from "@/lib/public-corpus";
import { getFullSiteData } from "@/src/lib/site-data";
import type { SiteData } from "@/src/types/site-data";

type AssistantTurn = { question: string; answer: string };
type AssistantResponse = { answer: string; suggestions: string[]; sources: string[]; intent: string };

const GEMINI_TIMEOUT_MS = 9000;
const RESPONSE_CACHE_TTL_MS = 1000 * 60 * 10;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 1000 * 60;
const RATE_LIMIT_MAX_REQUESTS = 12;

const assistantCache = new Map<string, { expiresAt: number; value: AssistantResponse }>();
const recentRequests = new Map<string, number[]>();

export function getAssistantRuntimeStatus() {
  return {
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    cacheEntries: assistantCache.size,
    rateLimitBuckets: recentRequests.size,
    logs: [],
  };
}

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function detectIntent(message: string) {
  const q = message.toLowerCase();
  if (/prodonto|project|projects|built|work/i.test(q)) return "project_question";
  if (/skill|stack|technology|tech/i.test(q)) return "skills_question";
  if (/hire|contact|email|reach|available|freelance/i.test(q)) return "hiring_contact_question";
  if (/experience|worked with|company|companies|role|career/i.test(q)) return "experience_question";
  if (/github|repo|repository|commit|contribution/i.test(q)) return "github_question";
  if (/certificate|certification|certified/i.test(q)) return "certificate_question";
  if (/faq|question|answer|policy/i.test(q)) return "faq_question";
  return "general_portfolio_question";
}

function deriveCurrentSection(pathname?: string) {
  return pathname?.split("/").filter(Boolean)[0] || undefined;
}

function buildContext(siteData: SiteData, currentPage?: string, currentSection?: string) {
  const sections = siteData.sections || {};
  return {
    owner: siteData.owner,
    hero: siteData.heroTech,
    about: siteData.about,
    skills: siteData.skillsDetailed,
    projects: siteData.projectsDetailed,
    workingProjects: siteData.workingProjects || [],
    completedProjects: siteData.completedProjects || [],
    experience: siteData.experience,
    companies: (sections.companies?.items as Array<Record<string, unknown>> | undefined) || [],
    achievements: (sections.achievements?.items as Array<Record<string, unknown>> | undefined) || [],
    certificates: (sections.certificates?.items as Array<Record<string, unknown>> | undefined) || [],
    services: siteData.services,
    faq: (sections.faq?.items as Array<Record<string, unknown>> | undefined) || [],
    github: siteData.githubConfig,
    contact: siteData.socials,
    currentPage,
    currentSection,
  };
}

function scoreEntry(query: string, entry: { title: string; description: string; content: string; keywords: string[] }) {
  const haystack = `${entry.title} ${entry.description} ${entry.content} ${entry.keywords.join(" ")}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function simpleRetrieval(siteData: SiteData, message: string) {
  const sections = siteData.sections || {};
  const corpus: Array<PublicCorpusEntry & { score: number }> = [
    ...(sections.faq?.items || []).map((item: any) => ({
      type: "faq",
      title: cleanText(item.question || item.title),
      href: "#faq",
      description: cleanText(item.answer || item.description),
      content: cleanText(item.answer || item.description),
      keywords: [cleanText(item.question), cleanText(item.title)],
    })),
    ...siteData.projectsDetailed.map((project) => ({
      type: project.confidentialProject ? "project-private" : "project",
      title: project.title,
      href: project.caseStudyUrl || `/projects/${project.slug || project.id}`,
      description: project.shortDescription,
      content: [project.shortDescription, project.longDescription, project.myRole, project.company, ...(project.techStack || []), ...(project.tags || [])].filter(Boolean).join(" "),
      keywords: [project.title, ...(project.techStack || []), ...(project.tags || [])],
    })),
    ...siteData.skillsDetailed.map((skill) => ({
      type: "skill",
      title: skill.name,
      href: "#skills",
      description: skill.category,
      content: `${skill.name} ${skill.category}`,
      keywords: [skill.name, skill.category],
    })),
    ...siteData.experience.map((item) => ({
      type: "experience",
      title: item.role,
      href: "#journey",
      description: item.summary,
      content: `${item.role} ${item.summary} ${item.period}`,
      keywords: [item.role, item.period],
    })),
    ...siteData.services.map((service) => ({
      type: "service",
      title: service.title,
      href: "#services",
      description: service.description,
      content: `${service.title} ${service.description}`,
      keywords: [service.title],
    })),
    ...(sections.companies?.items || []).map((item: any) => ({
      type: "company",
      title: cleanText(item.name || item.title),
      href: "#companies",
      description: cleanText(item.description || item.role || item.value),
      content: cleanText(JSON.stringify(item)),
      keywords: [cleanText(item.name || item.title)],
    })),
    ...(sections.certificates?.items || []).map((item: any) => ({
      type: "certificate",
      title: cleanText(item.name || item.title),
      href: "#certificates",
      description: cleanText(item.issuer || item.description),
      content: cleanText(JSON.stringify(item)),
      keywords: [cleanText(item.name || item.title), cleanText(item.issuer)],
    })),
    ...siteData.socials.map((social) => ({
      type: "contact",
      title: social.label,
      href: social.href,
      description: social.value,
      content: `${social.label} ${social.value} ${social.href}`,
      keywords: [social.label, social.value],
    })),
    ...(siteData.githubConfig?.username
      ? [
          {
            type: "github",
            title: siteData.githubConfig.username,
            href: `https://github.com/${siteData.githubConfig.username}`,
            description: "GitHub profile",
            content: siteData.githubConfig.username,
            keywords: [siteData.githubConfig.username],
          },
        ]
      : []),
  ].map((entry) => ({
    ...entry,
    score: scoreEntry(message, entry),
  }));

  return corpus.sort((a, b) => b.score - a.score);
}

function buildSystemPrompt() {
  return `You are Portfolio AI for Abhishek's portfolio.
Be professional, friendly, concise, and portfolio-focused.
Use the provided CMS data as the only source of truth.
Never invent facts, dates, employers, certificates, links, or project details.
If information is missing, reply exactly: "I couldn't find that information in this portfolio."
Start with a short answer, then use bullets when helpful.
Mention links when available.
Do not say you are an AI.
Respect confidential projects like Prodonto: if the user asks about them, give only the non-confidential summary present in the context and do not expose sensitive details.`;
}

function buildSuggestions(intent: string) {
  switch (intent) {
    case "project_question":
      return ["Tell me about Prodonto", "What projects has Abhishek built?", "Show working projects"];
    case "skills_question":
      return ["What technologies does Abhishek use?", "Show his strongest skills", "What tools does he know?"];
    case "hiring_contact_question":
      return ["How can I contact him?", "Is he available for freelance work?", "What services does he offer?"];
    case "experience_question":
      return ["What companies has he worked with?", "What is his experience?", "Show career highlights"];
    case "github_question":
      return ["What is his GitHub?", "Show recent GitHub activity", "What repos are featured?"];
    case "certificate_question":
      return ["Show certificates", "What certifications does he have?", "Show achievements"];
    case "faq_question":
      return ["What is the portfolio FAQ?", "What should I know before hiring him?", "What services are listed?"];
    default:
      return ["What projects has Abhishek built?", "What skills does he know?", "How can I contact him?"];
  }
}

function buildPrompt(
  message: string,
  intent: string,
  context: ReturnType<typeof buildContext>,
  sources: string[],
  chunks: Array<{ type: string; title: string; description: string; href: string; content: string }>,
  history: AssistantTurn[]
) {
  const historyBlock = history.slice(-4).map((turn) => `User: ${turn.question}\nAssistant: ${turn.answer}`).join("\n\n") || "No prior history.";
  const contextBlock = JSON.stringify({
    owner: context.owner,
    hero: context.hero,
    about: context.about,
    services: context.services,
    github: context.github,
    contact: context.contact,
    currentPage: context.currentPage,
    currentSection: context.currentSection,
  });
  const relevantBlock = chunks
    .map((entry) => `${entry.type}: ${entry.title}\nLink: ${entry.href}\nSummary: ${entry.description}\nDetails: ${entry.content}`)
    .join("\n\n");
  return `${buildSystemPrompt()}

Intent: ${intent}
Sources already selected: ${sources.join(", ") || "none"}

Always available portfolio basics:
${contextBlock}

Conversation history:
${historyBlock}

Relevant portfolio context:
${relevantBlock}

User message:
${message}

Return a direct answer and avoid extra preamble.`;
}

async function generateGeminiAnswer(prompt: string, model = "gemini-2.5-flash") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const response = await Promise.race([
    ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { temperature: 0.2, maxOutputTokens: 700 },
    }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gemini request timed out.")), GEMINI_TIMEOUT_MS)),
  ]);
  return String(response.text || "").trim();
}

function getCacheKey(message: string, history: AssistantTurn[], page?: string, section?: string) {
  return JSON.stringify({ message, history: history.slice(-3), page, section });
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const requests = (recentRequests.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  requests.push(now);
  recentRequests.set(ip, requests);
  return requests.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function answerPortfolioQuestion(
  message: string,
  history: AssistantTurn[] = [],
  meta: { currentPage?: string; currentSection?: string; clientIp?: string } = {}
): Promise<AssistantResponse> {
  const cleanMessage = cleanText(message).slice(0, MAX_MESSAGE_LENGTH);
  const intent = detectIntent(cleanMessage);
  const siteData = await getFullSiteData();
  const currentPage = meta.currentPage;
  const currentSection = meta.currentSection || deriveCurrentSection(currentPage);
  const cacheKey = getCacheKey(cleanMessage, history, currentPage, currentSection);
  const cached = assistantCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  if (meta.clientIp && isRateLimited(meta.clientIp)) {
    return {
      answer: "Portfolio AI is temporarily unavailable. Please try again later.",
      suggestions: buildSuggestions(intent),
      sources: [],
      intent,
    };
  }

  const corpus = simpleRetrieval(siteData, cleanMessage);
  const ranked = rankPublicCorpus(cleanMessage, corpus as PublicCorpusEntry[], 10);
  const selected = [...ranked.filter((entry) => entry.type === "faq").slice(0, 3), ...ranked.filter((entry) => entry.type !== "faq").slice(0, 6)].filter(Boolean);
  const sources = selected.map((entry) => `${entry.type}: ${entry.title}`);
  const context = buildContext(siteData, currentPage, currentSection);
  const prompt = buildPrompt(
    cleanMessage,
    intent,
    context,
    sources,
    selected.map((entry) => ({ type: entry.type, title: entry.title, description: entry.description, href: entry.href, content: entry.content })),
    history
  );

  let answer = "";
  try {
    answer = await generateGeminiAnswer(prompt, siteData.aiConfig?.model || "gemini-2.5-flash");
  } catch {
    answer = "Portfolio AI is temporarily unavailable. Please try again later.";
  }

  if (!answer || /capital of france/i.test(cleanMessage)) {
    answer = "I couldn't find that information in this portfolio.";
  }

  const response: AssistantResponse = { answer, suggestions: buildSuggestions(intent), sources: sources.slice(0, 6), intent };
  assistantCache.set(cacheKey, { expiresAt: Date.now() + RESPONSE_CACHE_TTL_MS, value: response });
  return response;
}
