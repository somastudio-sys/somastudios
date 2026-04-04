import OpenAI from "openai";
import { NextResponse } from "next/server";

const STORY_SYSTEM = `You help turn dreams into short interactive fiction. You always respond with valid JSON only, no markdown fences.

Schema:
{"segment": string (2-5 paragraphs of story prose in the requested genre),
 "choices": string[] }

Rules:
- The interactive story runs for at most three branching rounds after the opening segment (three "what happens next?" screens), then it must end—unless the user message explicitly marks the final segment.
- "choices" must be exactly 3 short labels (under 12 words each) for what could happen next. On the final segment request, return an empty choices array [].
- Match the literary genre the user asked for (voice, imagery, pacing).
- Do not copy the dream verbatim; transform and dramatise it.
- No graphic sexual or gratuitous violence; keep a thoughtful, literary tone.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Story generation is not configured. Add OPENAI_API_KEY to your environment.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const mode = body.mode === "continue" ? "continue" : "start";
    const genre = typeof body.genre === "string" ? body.genre.trim() : "";
    const dreamContent =
      typeof body.dreamContent === "string" ? body.dreamContent.trim() : "";
    const dreamTitle =
      typeof body.dreamTitle === "string" ? body.dreamTitle.trim() : "";
    const analysis =
      typeof body.analysis === "string" ? body.analysis.trim() : "";
    const storySoFar =
      typeof body.storySoFar === "string" ? body.storySoFar.trim() : "";
    const choice =
      typeof body.choice === "string" ? body.choice.trim() : "";
    const finalSegment = body.finalSegment === true;

    if (!dreamContent) {
      return NextResponse.json(
        { error: "Dream content is required." },
        { status: 400 }
      );
    }
    if (!genre) {
      return NextResponse.json({ error: "Genre is required." }, { status: 400 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const openai = new OpenAI({ apiKey });

    let userMessage: string;
    if (mode === "start") {
      userMessage = [
        `Literary genre: ${genre}`,
        dreamTitle ? `Working title: ${dreamTitle}` : "",
        "",
        "Dream:",
        dreamContent,
        analysis ? `\nReflection (optional context):\n${analysis}` : "",
        "",
        "Begin the interactive story. Return JSON with \"segment\" and \"choices\" (3 strings).",
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      if (!storySoFar) {
        return NextResponse.json(
          { error: "No story text to continue from." },
          { status: 400 }
        );
      }
      userMessage = [
        `Literary genre: ${genre}`,
        "",
        "Dream source (for continuity):",
        dreamContent.slice(0, 2000),
        "",
        "Story so far:",
        storySoFar,
        "",
        `The reader chose: "${choice}"`,
        "",
        finalSegment
          ? "This is the FINAL segment of a short branching story (the reader has already made three path choices). Bring the plot to a satisfying close. Return JSON with \"segment\" and \"choices\": [] — an empty array only, no further branches."
          : "Continue with the next segment. Return JSON with \"segment\" and \"choices\" (exactly 3 short strings for what could happen next).",
      ].join("\n");
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: STORY_SYSTEM },
        { role: "user", content: userMessage },
      ],
      max_tokens: mode === "start" ? 1200 : 1400,
      temperature: 0.85,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return NextResponse.json(
        { error: "No story was returned. Try again." },
        { status: 502 }
      );
    }

    let parsed: { segment?: string; choices?: string[] };
    try {
      parsed = JSON.parse(raw) as { segment?: string; choices?: string[] };
    } catch {
      return NextResponse.json(
        { error: "Could not parse story response." },
        { status: 502 }
      );
    }

    const segment = typeof parsed.segment === "string" ? parsed.segment.trim() : "";
    let choices = Array.isArray(parsed.choices)
      ? parsed.choices.filter((c) => typeof c === "string").slice(0, 3)
      : [];
    if (mode === "continue" && finalSegment) {
      choices = [];
    }

    if (!segment) {
      return NextResponse.json(
        { error: "Empty story segment." },
        { status: 502 }
      );
    }

    return NextResponse.json({ segment, choices });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Story generation failed.";
    console.error("[api/story]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
