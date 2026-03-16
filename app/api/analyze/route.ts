import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : undefined;

    if (!content) {
      return NextResponse.json(
        { error: "No dream content to analyse." },
        { status: 400 }
      );
    }

    // Stub: return a placeholder analysis. Replace with your Freud/LLM API call.
    const analysis =
      "This is a placeholder analysis. Connect your preferred analysis API (e.g. OpenAI, local model) in app/api/analyze/route.ts. Consider themes of symbolism, wish-fulfilment, and latent content in the dream narrative.";

    return NextResponse.json({ analysis });
  } catch {
    return NextResponse.json(
      { error: "Analysis failed." },
      { status: 500 }
    );
  }
}
