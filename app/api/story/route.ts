import OpenAI from "openai";
import { NextResponse } from "next/server";

/** Tight genre rules — models drift to generic “literary” prose without this. Keys match `GENRES[].id` in the diary UI. */
const GENRE_CONTRACTS: Record<string, string> = {
  literary: `LITERARY FICTION (mandatory style):
- Prioritize interior psychology, subtext, and precise sensory detail over plot mechanics.
- Voice: controlled third-person or close first-person; nuanced, restrained; avoid melodrama and genre clichés.
- Sentence rhythm: varied; allow quiet moments and ambiguity; theme over twist.
- Do NOT default to noir cynicism, fantasy proper nouns, sci-fi tech, or gothic haunted-castle pastiche unless the dream truly demands it—stay in literary-realist or quietly experimental register.`,

  noir: `NOIR / HARD-BOILED DETECTIVE (mandatory style — this is NOT generic fiction):
- Setting & texture: night, city, rain or dry heat haze, cheap rooms, alleys, neon, smoke, shadows, institutional rot, moral grey zones. Anchor at least two concrete noir images per segment (e.g. wet asphalt, desk lamp, bruised sky, filing cabinet, last cigarette).
- Voice: spare, cynical, weary; short punchy sentences mixed with longer fatalistic ones; vernacular allowed; suspicion and doubt drive the prose.
- Themes: betrayal, secrecy, lust-as-trap, corruption, the case that isn’t what it seems.
- POV: first-person hard-boiled OR tight third on a jaded investigator or cornered protagonist.
- FORBIDDEN in this genre: cozy warmth as default tone, pastoral fairy-tale openings, high fantasy (thrones, spells, elves), space stations, mythic omniscient bard voice, inspirational self-help cadence.
- If the prose could be mistaken for “literary fiction” or “dream journal,” rewrite until the noir register is unmistakable.`,

  fantasy: `FANTASY (mandatory style):
- Use recognizable fantasy texture: magic, mythic stakes, non-modern secondary-world or mythic intrusion, proper names for places/factions where fitting.
- Voice may be epic-lyrical, sword-and-sorcery brisk, or mythic-fairy-tale—pick one and stay consistent.
- World logic: establish one clear magical or fantastical rule per segment when introducing new elements.
- FORBIDDEN default: pure slice-of-life realism with zero fantastical charge; hard-boiled noir monologue; hard SF tech exposition unless the dream clearly blends genres.`,
  scifi: `SCIENCE FICTION (mandatory style):
- Anchor every segment in speculative premise: future tech, space, AI, biotech, time dilation, climate collapse, etc.—be concrete (ship systems, interfaces, physics consequences), not vague “futuristic.”
- Voice: analytical, precise, or coldly lyrical; wonder and dread tied to implication of science/tech.
- Worldbuilding: one new speculative detail per beat where useful; avoid magic-wand solutions.
- FORBIDDEN as primary mode: high fantasy spellcraft, noir-only atmosphere with no SFnal idea, mythic fable tone without speculative premise.`,

  gothic: `GOTHIC HORROR (mandatory style):
- Atmosphere: dread, decay, the uncanny, isolation, family/ancestral guilt, storms, liminal architecture (manor, chapel, sea-cliff, crypt).
- Sensory palette: cold, mould, candle-flame, blood as implication, sound in empty space.
- Pace: slow dread and revelation; avoid action-movie beats unless the dream demands.
- FORBIDDEN default: cozy romance, noir gumshoe voice, space opera, ironic sitcom tone.`,
  romance: `ROMANCE (mandatory style):
- Center emotional tension between characters: desire, obstacle, vulnerability, misunderstanding, reconciliation or tragic parting.
- Intimacy: emotional and sensory closeness; keep explicit sex off-page per safety rules—use tension and aftermath.
- Voice: warm, yearning, conflicted, or wistful—not cynical noir by default.
- FORBIDDEN default: pure horror dread, hard-boiled investigation, or cold SF concept piece with no relational heart.`,

  magical: `MAGICAL REALISM (mandatory style):
- Everyday world + impossible events treated as matter-of-fact; no high-fantasy quest framing.
- Political/historical undertone optional; family and memory often central; one strange image carries symbolic weight.
- Tone: calm narration of the uncanny; avoid epic fantasy diction (“realm,” “prophecy”) unless ironic.
- FORBIDDEN default: spaceships, noir casefile, gothic haunted-house-only without social texture.`,
  myth: `MYTH / FABLE (mandatory style):
- Timeless, oral-tradition cadence; archetypes (stranger, king, beast, threshold); repetition and parallelism welcome.
- Diction slightly elevated but clear; distance from modern slang unless archly.
- Structure: moral or cosmic consequence visible in the weave of events.
- FORBIDDEN default: contemporary detective noir, technical SF, domestic realism without mythic frame.`,
};

const DEFAULT_GENRE_CONTRACT = `Match the genre label the user chose with unmistakable voice, setting, and diction. Do not write neutral “could be anything” prose—genre must be obvious from wording alone.`;

const GENRE_ANCHORS: Record<string, string[]> = {
  literary: ["interior monologue", "precise sensory detail", "subtext"],
  noir: ["neon", "wet asphalt", "case file", "smoke", "alley"],
  fantasy: ["spell", "sigil", "ruin", "kingdom", "oracle"],
  scifi: [
    "airlock",
    "orbital",
    "quantum",
    "telemetry",
    "cryo",
    "drone swarm",
    "biosensor",
    "synthetic intelligence",
    "reactor",
    "time dilation",
  ],
  gothic: ["manor", "crypt", "candle", "storm", "ancestral portrait"],
  romance: ["longing", "confession", "touch", "distance", "reconciliation"],
  magical: ["ordinary street", "impossible omen", "family memory"],
  myth: ["threshold", "omen", "oath", "beast", "oracle"],
};

function resolveGenreContract(genreId: string | undefined, genreLabel: string): string {
  const id = typeof genreId === "string" ? genreId.trim().toLowerCase() : "";
  if (id && GENRE_CONTRACTS[id]) {
    return GENRE_CONTRACTS[id];
  }
  const label = genreLabel.trim().toLowerCase();
  const labelToId: [string, string][] = [
    ["literary fiction", "literary"],
    ["noir", "noir"],
    ["detective", "noir"],
    ["fantasy", "fantasy"],
    ["science fiction", "scifi"],
    ["sci-fi", "scifi"],
    ["gothic", "gothic"],
    ["horror", "gothic"],
    ["romance", "romance"],
    ["magical realism", "magical"],
    ["myth", "myth"],
    ["fable", "myth"],
  ];
  for (const [needle, key] of labelToId) {
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
  const labelToId: [string, string][] = [
    ["literary fiction", "literary"],
    ["noir", "noir"],
    ["detective", "noir"],
    ["fantasy", "fantasy"],
    ["science fiction", "scifi"],
    ["sci-fi", "scifi"],
    ["gothic", "gothic"],
    ["horror", "gothic"],
    ["romance", "romance"],
    ["magical realism", "magical"],
    ["myth", "myth"],
    ["fable", "myth"],
  ];
  for (const [needle, key] of labelToId) {
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
    ? `Genre anchors (must use at least 2 naturally in EACH segment and at least 1 in the choice labels combined): ${genreAnchors.join(", ")}.`
    : "Genre anchors: use concrete diction and motifs tied to the selected genre.";

  return `You turn dreams into short interactive fiction. Respond with valid JSON only, no markdown fences.

Schema:
{"segment": string (2-5 paragraphs of story prose),
 "choices": string[] }

Global rules:
- The story has at most three branching rounds after the opening (three "what happens next?" screens), then it ends—unless the user message marks the final segment.
- "choices": exactly 3 short labels (under 12 words each), OR [] on the final segment only.
- Do not copy the dream verbatim; transform and dramatise it.
- No graphic sex or gratuitous violence; keep a thoughtful tone.
- Perspective is mandatory: third person only.
  - Never use first-person pronouns (I, me, my, we, us, our).
  - Never address the reader directly with second person (you, your).
  - Keep narration and all choice labels in third-person framing.

SELECTED GENRE (user-facing label): "${genreLabel}"

GENRE CONTRACT — obey in every segment; do not drift into a generic voice:
${genreContract}

${anchorsBlock}

Additional anti-generic constraints:
- Ban vague filler like "something felt strange," "an unknown force," "everything changed" unless followed by concrete genre detail.
- Choices must be specific scene actions in this genre, not abstract prompts.
- Choice-label style contract (mandatory):
  - Start each choice with a strong action verb.
  - Include at least one concrete object/system/place in the same line.
  - Avoid generic labels like "Take a chance", "Investigate", "Keep going", "Try something else", "Ask questions".
  - Keep each label under 12 words, but make it vivid and scene-specific.

Self-check before returning JSON: If a reader blind to the label could not name the genre from diction and texture alone, rewrite the segment until they could.`;
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
        `You are writing ONLY in: ${genre}. The GENRE CONTRACT in your instructions is binding.`,
        dreamTitle ? `Working title: ${dreamTitle}` : "",
        "",
        "Dream (source material — do not paste verbatim):",
        dreamContent,
        analysis
          ? `\nFreudian reflection (optional context only — do not lecture; dramatise):\n${analysis}`
          : "",
        "",
        "Begin the interactive story. Return JSON with \"segment\" and \"choices\" (3 strings). Every choice label must sound like the next beat in THIS genre, not a generic fork. Choices should read like cinematic micro-actions. Third-person only.",
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
        `Stay in genre: ${genre}. Do not soften into neutral prose.`,
        "",
        "Dream source (continuity only, truncated):",
        dreamContent.slice(0, 2000),
        "",
        "Story so far:",
        storySoFar,
        "",
        `The reader chose: "${choice}"`,
        "",
        finalSegment
          ? "This is the FINAL segment of a short branching story (the reader has already made three path choices). Bring the plot to a satisfying close in the SAME genre. Return JSON with \"segment\" and \"choices\": [] — an empty array only, no further branches. Third-person only."
          : "Continue with the next segment in the SAME genre. Return JSON with \"segment\" and \"choices\" (exactly 3 short strings for what could happen next; each option must feel native to this genre and read like a specific action shot, not a generic prompt). Third-person only.",
      ].join("\n");
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userMessage },
      ],
      max_tokens: mode === "start" ? 1200 : 1400,
      temperature: 0.72,
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