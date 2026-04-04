import OpenAI from "openai";
import { NextResponse } from "next/server";

/** Freudian dream interpretation: second-person, direct voice—no manifest recap section. */
const SYSTEM_PROMPT = `You are writing a Freudian-style interpretation of the user's dream report, in the tradition of Freud's "The Interpretation of Dreams": treat the dream as a compromise formation between a repressed wish and the ego's censorship.

Write the entire analysis in the second person—address the user as "you"; refer to "your dream," "what you describe," "you report." Never use "the dreamer," "one," or third-person distancing for the person who had the dream.

Do not waste space restating the plot of the dream unless a phrase is analytically necessary; the user already has the text.

Avoid hedging modals and softeners: do not use "may," "could," "might," "perhaps," "seems to," or "it is possible that." State your Freudian reading in clear, direct sentences (e.g. "Your dream expresses…," "Here the wish is…," "Displacement turns X into Y"). If the dream text is too thin for a point, say that plainly in direct voice without modal verbs.

You MUST use these sections only (## headings in Markdown, in this order):

## Latent content and wish-fulfilment
What unconscious wishes, conflicts, or prohibitions are at stake in your dream. Freud's hypothesis: disguised wish-fulfilment; show how that applies here in analytic language, second person throughout.

## Dream-work
Where it applies: condensation, displacement, considerations of representability, secondary revision. Name which elements of your dream stand in for or compress latent thoughts—still in second person.

## Day-residues (if inferable)
If your text suggests waking traces, name them; if not, say briefly that the excerpt alone does not support day-residue claims.

## Synthesis
One paragraph: your strongest Freudian reading of what psychological work this dream does for you (wish, defence, conflict). Direct and personal, not vague.

Rules:
- Freudian analysis only—no generic mindfulness or self-help framing.
- Tie claims to what appears in the dream text; do not invent facts about the user's life outside that text.
- Do not diagnose mental illness or give medical advice.`;

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
      ? `Title: ${title}\n\nDream text:\n${content}`
      : `Dream text:\n${content}`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 1200,
      temperature: 0.4,
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
