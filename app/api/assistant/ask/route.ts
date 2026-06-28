import { NextResponse } from "next/server";
import { answerPortfolioQuestion } from "@/lib/assistant";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const question = String(body.question || "").trim();
  if (!question) return NextResponse.json({ ok: false, error: "Question is required" }, { status: 400 });

<<<<<<< HEAD
  const history = Array.isArray(body.history)
    ? body.history
        .map((item: { question?: unknown; answer?: unknown }) => ({
          question: String(item?.question || ""),
          answer: String(item?.answer || ""),
        }))
        .filter((item: { question: string; answer: string }) => item.question && item.answer)
    : [];

  const result = await answerPortfolioQuestion(question, history);
=======
  const result = await answerPortfolioQuestion(question);
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  return NextResponse.json({ ok: true, ...result });
}
