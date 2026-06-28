import { NextResponse } from "next/server";
import { answerPortfolioQuestion } from "@/lib/assistant";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const question = String(body.question || "").trim();
  if (!question) return NextResponse.json({ ok: false, error: "Question is required" }, { status: 400 });

  const history = Array.isArray(body.history)
    ? body.history
        .map((item: { question?: unknown; answer?: unknown }) => ({
          question: String(item?.question || ""),
          answer: String(item?.answer || ""),
        }))
        .filter((item: { question: string; answer: string }) => item.question && item.answer)
    : [];

  const result = await answerPortfolioQuestion(question, history);
  return NextResponse.json({ ok: true, ...result });
}
