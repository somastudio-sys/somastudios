import OpenAI from "openai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a gentle dream companion for Soma, a private dream diary app. You draw lightly on Freudian ideas (manifest vs latent content, displacement, condensation, symbols) as optional lenses—not as rigid doctrine.

Write a short, warm reflection (about 3–6 short paragraphs). Acknowledge emotional tone and possible themes; invite curiosity rather than certainty.

Rules:
- Do not diagnose mental health conditions or give medical advice.
- Do not claim to know the dreamer's life; use tentative language ("might," "could," "one reading").
- Keep the tone calm and respectful.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Dream analysis is not configured. Add OPENAI_API_KEY to your environment (see .env.example).",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : undefined;

    if (!content) {
      return NextResponse.json(
        { error: "No dream content to analyse." },
        { status: 400 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const openai = new OpenAI({ apiKey });

    const userMessage = title
      ? `Title: ${title}\n\nDream:\n${content}`
      : `Dream:\n${content}`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 900,
      temperature: 0.65,
    });

    const analysis = completion.choices[0]?.message?.content?.trim();
    if (!analysis) {
      return NextResponse.json(
        { error: "No analysis was returned. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Analysis failed.";
    console.error("[api/analyze]", err);
    return NextResponse.json(
      { error: message.includes("API key") ? "Invalid or missing API key." : message },
      { status: 500 }
    );
  }
}
