import OpenAI from "openai";
import { NextResponse } from "next/server";

/** Genre style rules — voice/diction only. Dream plot always wins over these. Keys match `GENRES[].id` in the diary UI. */
const GENRE_CONTRACTS: Record<string, string> = {
  horror: `HORROR (mandatory style — voice only; dream plot still leads):
- Atmosphere: dread, the uncanny, threat, isolation, wrongness in familiar places; sensory detail that unsettles (sound, cold, wrong scale, something watching).
- Pace: tension that builds; implication over gore; fear of what comes next.
- Voice: tight third-person; spare or creeping sentences; the world feels unsafe.
- FORBIDDEN default: cozy warmth, romcom banter, slapstick comedy, pure puzzle-box mystery with no fear.`,

  mystery: `MYSTERY (mandatory style — voice only; dream plot still leads):
- Engine: questions, clues, withheld information, deduction, revelation; what isn’t said matters as much as what is.
- Texture: observation, contradiction, timing, evidence hidden in ordinary dream details — do not invent a police case the dream never had.
- Voice: clear, observant third-person; curiosity and unease in balance.
- FORBIDDEN default: pure slapstick, romance-first with no unanswered question, horror gore without investigation of the unknown.`,

  suspense: `SUSPENSE (mandatory style — voice only; dream plot still leads):
- Engine: anticipation, delayed payoff, rising stakes, “something is about to happen”; each beat tightens the screw.
- Texture: ticking pressure, watched spaces, narrow choices, silence before the turn; peril felt more than shown.
- Voice: lean, propulsive; breath-holding stillness mixed with urgency.
- FORBIDDEN default: relaxed comedy, cozy resolution early, leisurely slice-of-life with no mounting tension.`,

  romance: `ROMANCE (mandatory style — voice only; dream plot still leads):
- Center emotional tension between characters who appear in the dream: desire, obstacle, vulnerability, misunderstanding, closeness or parting.
- Intimacy: emotional and sensory; keep explicit sex off-page — use tension and aftermath.
- Voice: warm, yearning, conflicted, or wistful.
- FORBIDDEN default: pure horror dread, comedy that mocks the bond, cold procedural with no relational heart.`,

  comedy: `COMEDY (mandatory style — voice only; dream plot still leads):
- Engine: wit, absurdity, mishaps, ironic timing, comic friction between characters or situations — drawn from the dream’s own oddness, not a sitcom set-piece.
- Voice: buoyant or deadpan; playful third-person; laughter without cruelty.
- FORBIDDEN default: gothic dread as main note, tragedy spiral, grim thriller jeopardy as the dominant texture.`,
};

const DEFAULT_GENRE_CONTRACT = `Match the genre label with unmistakable voice and diction while staging the dream's own scenes. Do not invent a different plot to "fit" the genre.`;

const GENRE_ANCHORS: Record<string, string[]> = {
  horror: ["shadow", "cold breath", "wrong silence", "threshold", "watched"],
  mystery: ["clue", "contradiction", "half-answer", "timeline", "hidden detail"],
  suspense: ["held breath", "deadline", "footsteps", "narrow escape", "almost"],
  romance: ["longing", "confession", "touch", "distance", "reconciliation"],
  comedy: ["timing", "mishap", "banter", "absurd detail", "grin"],
};

const LABEL_TO_GENRE: [string, string][] = [
  ["horror", "horror"],
  ["gothic", "horror"],
  ["mystery", "mystery"],
  ["detective", "mystery"],
  ["suspense", "suspense"],
  ["suspence", "suspense"],
  ["thriller", "suspense"],
  ["romance", "romance"],
  ["comedy", "comedy"],
  ["light-hearted", "comedy"],
  ["lighthearted", "comedy"],
  ["satire", "comedy"],
];

function resolveGenreContract(genreId: string | undefined, genreLabel: string): string {
  const id = typeof genreId === "string" ? genreId.trim().toLowerCase() : "";
  if (id && GENRE_CONTRACTS[id]) {
    return GENRE_CONTRACTS[id];
  }
  const label = genreLabel.trim().toLowerCase();
  for (const [needle, key] of LABEL_TO_GENRE) {
    if (label.includes(needle)) {
      const c = GENRE_CONTRACTS[key];
      if (c) return c;
    }
  }
  return DEFAULT_GENRE_CONTRACT;
}

function resolveGenreKey(genreId: string | undefined, genreLabel: string): string {
  const id = typeof genreId === "string" ? genreId.trim().toLowerCase() : "";
  if (id && GENRE_CONTRACTS[id]) return id;
  const label = genreLabel.trim().toLowerCase();
  for (const [needle, key] of LABEL_TO_GENRE) {
    if (label.includes(needle)) return key;
  }
  return "";
}

function buildStorySystem(
  genreLabel: string,
  genreContract: string,
  genreAnchors: string[]
): string {
  const anchorsBlock = genreAnchors.length
    ? `Genre texture words (optional flavour only — use at most 1–2 if they fit WITHOUT inventing new plot locations or objects the dream did not contain): ${genreAnchors.join(", ")}.`
    : "Genre texture: apply voice and diction from the genre contract without inventing new plot.";

  return `You turn dreams into short interactive fiction. Respond with valid JSON only, no markdown fences.

Schema:
{"segment": string (2-5 paragraphs of story prose),
 "choices": string[] }

════════════════════════════════════════
DREAM FIDELITY — STRICT RULE (HIGHEST PRIORITY)
════════════════════════════════════════
The user's dream is the ONLY plot source. Genre is a LENS (voice, tone, diction), never a license to invent a different story.

Mandatory:
1. Retell THIS dream's full plot: every major event, beat, place, person, object, and outcome the dreamer described, in the dream's sequence (or a clear dramatised order that still covers the whole plot by the end).
2. Keep the dream's characters, relationships, settings, and concrete details. Rename for third-person drama only if needed; do not replace them with genre stock characters (detectives, spaceships, castles, etc.) unless the dream already contains them.
3. Do not abandon the dream for a "better" genre story. If genre and dream conflict, KEEP THE DREAM and colour it with genre voice.
4. Do not invent a new primary setting, conflict, or cast that the dream never established.
5. Branching choices must be forks WITHIN the dream's ongoing situation — alternative next actions for the dream's characters in the dream's places — not escapes into unrelated genre plots.
6. Across the full interactive story (opening + branches), the complete dream plot must be present: nothing important from the dream may be dropped.
7. You may dramatise, heighten, and rephrase — but the reader who wrote the dream must recognise their dream's story on every page.

FORBIDDEN:
- Starting in a genre-typical world that ignores the dream's opening scene.
- Swapping the dream's events for genre tropes (a casefile, a spaceship mission, a quest) that the dream did not contain.
- Using Freudian analysis as a lecture or as an excuse to replace the plot with symbolism alone.
- Being merely "inspired by" the dream while telling a different story.

════════════════════════════════════════
STRUCTURE & VOICE
════════════════════════════════════════
- The story has at most three branching rounds after the opening (three "what happens next?" screens), then it ends—unless the user message marks the final segment.
- "choices": exactly 3 short labels (under 12 words each), OR [] on the final segment only.
- No graphic sex or gratuitous violence; keep a thoughtful tone.
- Perspective is mandatory: third person only.
  - Never use first-person pronouns (I, me, my, we, us, our).
  - Never address the reader directly with second person (you, your).
  - Keep narration and all choice labels in third-person framing.

SELECTED GENRE (user-facing label): "${genreLabel}"
Genre applies AFTER dream fidelity. Use it for atmosphere, sentence rhythm, and diction while staging the dream's own scenes.

GENRE CONTRACT — style only; never override dream plot:
${genreContract}

${anchorsBlock}

Choice-label style:
- Start each choice with a strong action verb.
- Name a concrete person, place, or object FROM THE DREAM in the same line.
- Avoid generic labels like "Take a chance", "Investigate", "Keep going", "Try something else", "Ask questions".
- Keep each label under 12 words.

Self-check before returning JSON (both must pass):
1. Dream check: Could the dreamer point to their dream's events, people, and places in this segment? If not, rewrite until they could.
2. Genre check: Does diction/texture match the selected genre WITHOUT changing whose story this is? If genre won over dream, rewrite until the dream leads.`;
}

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
    const genreId =
      typeof body.genreId === "string" ? body.genreId.trim() : undefined;
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

    const genreContract = resolveGenreContract(genreId, genre);
    const genreKey = resolveGenreKey(genreId, genre);
    const genreAnchors = genreKey ? GENRE_ANCHORS[genreKey] ?? [] : [];
    const systemContent = buildStorySystem(genre, genreContract, genreAnchors);

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const openai = new OpenAI({ apiKey });

    let userMessage: string;
    if (mode === "start") {
      userMessage = [
        `Genre for VOICE ONLY: ${genre}. Dream plot is binding — do not invent a different story.`,
        dreamTitle ? `Working title: ${dreamTitle}` : "",
        "",
        "SOURCE DREAM (full plot — retell this story in third person; genre only colours how you tell it):",
        dreamContent,
        analysis
          ? `\nFreudian reflection (optional mood only — do NOT replace the dream plot with analysis):\n${analysis}`
          : "",
        "",
        "Begin the interactive story ON the dream's opening scene, with the dream's people and places. Cover the dream's early beats in this opening segment; later segments must continue the same dream plot through to its end. Return JSON with \"segment\" and \"choices\" (3 strings). Every choice must be a next action inside THIS dream. Third-person only.",
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
        `Genre for VOICE ONLY: ${genre}. Stay inside the SOURCE DREAM's plot — do not drift into a new story.`,
        "",
        "SOURCE DREAM (full plot — keep covering remaining dream beats not yet dramatised):",
        dreamContent,
        "",
        "Story so far:",
        storySoFar,
        "",
        `The reader chose: "${choice}"`,
        "",
        finalSegment
          ? "This is the FINAL segment (three path choices already made). Resolve the remaining dream plot to a close that still matches the dream's events and outcome, in genre voice. Return JSON with \"segment\" and \"choices\": [] — empty array only. Third-person only."
          : "Continue the NEXT beat of the SOURCE DREAM (not a new adventure). Return JSON with \"segment\" and \"choices\" (exactly 3 short strings; each must name a person/place/object from the dream). Third-person only.",
      ].join("\n");
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userMessage },
      ],
      max_tokens: mode === "start" ? 1400 : 1600,
      temperature: 0.55,
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