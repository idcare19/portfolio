import { NextResponse } from "next/server";
import { answerPortfolioQuestion } from "@/lib/assistant";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body.message || body.question || "").trim();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });
    if (message.length > 2000) return NextResponse.json({ error: "Message is too long" }, { status: 413 });

    const history = Array.isArray(body.history)
      ? body.history
          .map((item: { question?: unknown; answer?: unknown }) => ({ question: String(item?.question || ""), answer: String(item?.answer || "") }))
          .filter((item: { question: string; answer: string }) => item.question && item.answer)
      : [];

    const currentPage = String(body.currentPage || "");
    const currentSection = String(body.currentSection || "");
    const result = await answerPortfolioQuestion(message, history, {
      currentPage: currentPage || undefined,
      currentSection: currentSection || undefined,
      clientIp: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        answer: "Portfolio AI is temporarily unavailable. Please try again later.",
        suggestions: [],
        sources: [],
        intent: "general_portfolio_question",
      },
      { status: 503 }
    );
  }
}
