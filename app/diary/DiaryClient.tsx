"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DreamEntry } from "./types";
import { STORAGE_KEY } from "./types";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: SpeechRecognitionResultList }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const GENRES: { id: string; label: string }[] = [
  { id: "literary", label: "Literary fiction" },
  { id: "noir", label: "Noir / detective" },
  { id: "fantasy", label: "Fantasy" },
  { id: "scifi", label: "Science fiction" },
  { id: "gothic", label: "Gothic horror" },
  { id: "romance", label: "Romance" },
  { id: "magical", label: "Magical realism" },
  { id: "myth", label: "Myth / fable" },
];

function loadEntries(): DreamEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DreamEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: DreamEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function DiaryClient() {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [dreamDate, setDreamDate] = useState("");
  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamContent, setDreamContent] = useState("");
  const [toast, setToast] = useState<{ message: string; type?: string } | null>(
    null
  );
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [storyDream, setStoryDream] = useState<DreamEntry | null>(null);
  const [storyGenre, setStoryGenre] = useState<string | null>(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyLog, setStoryLog] = useState<string[]>([]);
  const [storyChoices, setStoryChoices] = useState<string[]>([]);
  const [storyEnded, setStoryEnded] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type?: string) => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    setEntries(loadEntries());
    setDreamDate(new Date().toISOString().slice(0, 10));
  }, []);

  const persist = useCallback((next: DreamEntry[]) => {
    setEntries(next);
    saveEntries(next);
  }, []);

  const saveDream = () => {
    const content = dreamContent.trim();
    if (!content) {
      showToast("Write or record something first.");
      return;
    }
    const date = dreamDate || new Date().toISOString().slice(0, 10);
    const title = dreamTitle.trim() || undefined;
    const newDream: DreamEntry = {
      id: `dream-${Date.now()}`,
      date,
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    const next = [...loadEntries(), newDream];
    persist(next);
    setDreamContent("");
    setDreamTitle("");
    setDreamDate(new Date().toISOString().slice(0, 10));
    showToast("Dream saved to your archive.", "success");
  };

  const clearForm = () => {
    setDreamContent("");
    setDreamTitle("");
    setDreamDate(new Date().toISOString().slice(0, 10));
    showToast("Editor cleared.");
  };

  const deleteDream = (id: string) => {
    if (!confirm("Delete this dream from your diary?")) return;
    persist(loadEntries().filter((e) => e.id !== id));
    showToast("Dream removed.", "success");
  };

  const loadIntoEditor = (dream: DreamEntry) => {
    setDreamTitle(dream.title || "");
    setDreamDate(dream.date);
    setDreamContent(dream.content);
    showToast("Dream loaded into editor. You can edit and save again.");
  };

  const analyzeDream = async (dream: DreamEntry) => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: dream.content,
        title: dream.title || undefined,
      }),
    });
    const data = (await res.json()) as { analysis?: string; error?: string };
    if (!res.ok) throw new Error(data.error || "Analysis failed");
    return data.analysis as string;
  };

  const runAnalyze = async (id: string) => {
    const dream = loadEntries().find((e) => e.id === id);
    if (!dream) return;
    setAnalyzingId(id);
    try {
      const analysis = await analyzeDream(dream);
      const next = loadEntries().map((e) =>
        e.id === id
          ? {
              ...e,
              freudAnalysis: analysis,
              analyzedAt: new Date().toISOString(),
            }
          : e
      );
      persist(next);
      showToast("Freudian analysis saved.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setAnalyzingId(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as Window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRecognitionCtor =
      w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || "en-US";
    recognitionRef.current = recognition;

    recognition.onresult = (e: { results: SpeechRecognitionResultList }) => {
      const last = e.results.length - 1;
      const transcript = e.results[last][0].transcript;
      if (e.results[last].isFinal) {
        setDreamContent((prev) =>
          prev ? `${prev} ${transcript}` : transcript
        );
      }
    };
    recognition.onerror = (e: { error: string }) => {
      if (e.error !== "aborted") {
        showToast(`Speech error: ${e.error || "unknown"}`);
      }
      setRecording(false);
    };
    recognition.onend = () => setRecording(false);

    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
    };
  }, [showToast]);

  const toggleRecord = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      showToast("Speech recognition is not supported in this browser.");
      return;
    }
    if (recording) {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      setRecording(false);
      return;
    }
    try {
      recognition.start();
      setRecording(true);
      showToast("Listening… speak your dream.");
    } catch {
      showToast("Could not start microphone.");
    }
  };

  const openStory = (dream: DreamEntry) => {
    if (!dream.freudAnalysis) {
      showToast("Run “Analyse (Freud)” on this dream first, then you can start a story journey.");
      return;
    }
    setStoryDream(dream);
    setStoryGenre(null);
    setStoryLog([]);
    setStoryChoices([]);
    setStoryEnded(false);
  };

  const closeStory = () => {
    setStoryDream(null);
    setStoryGenre(null);
    setStoryLog([]);
    setStoryChoices([]);
    setStoryEnded(false);
    setStoryLoading(false);
  };

  const storySoFarText = storyLog.join("\n\n");

  const startStory = async () => {
    if (!storyDream || !storyGenre) return;
    setStoryLoading(true);
    setStoryLog([]);
    setStoryChoices([]);
    setStoryEnded(false);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "start",
          genre: storyGenre,
          dreamContent: storyDream.content,
          dreamTitle: storyDream.title,
          analysis: storyDream.freudAnalysis,
        }),
      });
      const data = (await res.json()) as {
        segment?: string;
        choices?: string[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Story failed");
      setStoryLog([data.segment || ""]);
      setStoryChoices(data.choices?.length ? data.choices : []);
      setStoryEnded(!data.choices?.length);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Story failed.");
    } finally {
      setStoryLoading(false);
    }
  };

  const continueStory = async (choice: string) => {
    if (!storyDream || !storyGenre) return;
    setStoryLoading(true);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "continue",
          genre: storyGenre,
          dreamContent: storyDream.content,
          dreamTitle: storyDream.title,
          analysis: storyDream.freudAnalysis,
          storySoFar: storySoFarText,
          choice,
        }),
      });
      const data = (await res.json()) as {
        segment?: string;
        choices?: string[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Story failed");
      setStoryLog((prev) => [...prev, data.segment || ""]);
      const next = data.choices?.length ? data.choices : [];
      setStoryChoices(next);
      setStoryEnded(next.length === 0);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Story failed.");
    } finally {
      setStoryLoading(false);
    }
  };

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <main className="diary" id="diary">
        <header className="diary-header">
          <h2>Your nightly entries</h2>
          <p className="tagline">
            Capture and recreate the things that disturb you at night.
          </p>
        </header>

        <section className="entry-section">
          <div className="entry-toolbar">
            <label className="date-label">
              <span>Date of dream</span>
              <input
                type="date"
                id="dream-date"
                value={dreamDate}
                onChange={(e) => setDreamDate(e.target.value)}
              />
            </label>
            <label className="title-label">
              <span>Title (optional)</span>
              <input
                type="text"
                id="dream-title"
                placeholder="e.g. The flying house"
                maxLength={80}
                value={dreamTitle}
                onChange={(e) => setDreamTitle(e.target.value)}
              />
            </label>
          </div>

          <div className="textarea-wrapper">
            <textarea
              id="dream-content"
              placeholder="Type your dream here, or tap the microphone to speak it..."
              rows={8}
              value={dreamContent}
              onChange={(e) => setDreamContent(e.target.value)}
            />
            <button
              type="button"
              id="record-btn"
              className={`record-btn${recording ? " recording" : ""}`}
              title="Record with voice"
              aria-label={recording ? "Stop recording" : "Start voice recording"}
              onClick={toggleRecord}
            >
              <span className="mic-icon" aria-hidden="true">
                🎤
              </span>
              <span className="record-label">{recording ? "Stop" : "Record"}</span>
            </button>
          </div>

          <div className="entry-actions">
            <button
              type="button"
              id="save-btn"
              className="btn btn-primary"
              onClick={saveDream}
            >
              Save dream
            </button>
            <button
              type="button"
              id="clear-btn"
              className="btn btn-ghost"
              onClick={clearForm}
            >
              Clear
            </button>
          </div>
        </section>

        <section className="archive-section">
          <h2>Archive</h2>
          <div id="archive-list" className="archive-list">
            {sorted.length === 0 ? (
              <p className="empty-archive">
                No dreams archived yet. Write one above and save it.
              </p>
            ) : (
              sorted.map((dream) => {
                const title = dream.title || "Untitled dream";
                const dateStr = new Date(dream.date).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );
                const short =
                  dream.content.slice(0, 180) +
                  (dream.content.length > 180 ? "…" : "");
                return (
                  <article key={dream.id} className="dream-card" data-id={dream.id}>
                    <div className="dream-card-header">
                      <h3 className="dream-card-title">{title}</h3>
                      <time className="dream-card-date">{dateStr}</time>
                    </div>
                    <p className="dream-card-content">{short}</p>
                    {dream.freudAnalysis && (
                      <details className="dream-analysis">
                        <summary className="toggle-analysis">Freud analysis</summary>
                        <div className="dream-analysis-text">{dream.freudAnalysis}</div>
                      </details>
                    )}
                    <div className="dream-card-actions">
                      <button
                        type="button"
                        className="expand"
                        onClick={() => loadIntoEditor(dream)}
                      >
                        Read full
                      </button>
                      <button
                        type="button"
                        className="analyze"
                        disabled={analyzingId === dream.id}
                        onClick={() => runAnalyze(dream.id)}
                      >
                        {analyzingId === dream.id
                          ? "Analysing…"
                          : dream.freudAnalysis
                            ? "Re-analyse"
                            : "Analyse (Freud)"}
                      </button>
                      <button
                        type="button"
                        className="story-journey"
                        onClick={() => openStory(dream)}
                        title={
                          dream.freudAnalysis
                            ? "Turn this dream into an interactive story"
                            : "Analyse first"
                        }
                      >
                        Story journey
                      </button>
                      <button
                        type="button"
                        className="delete"
                        onClick={() => deleteDream(dream.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <div
          id="toast"
          className={`toast${toast ? " show" : ""}${toast?.type === "success" ? " success" : ""}`}
          aria-live="polite"
          aria-hidden={!toast}
        >
          {toast?.message}
        </div>
      </main>

      {storyDream && (
        <div
          className="story-journey-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-journey-title"
        >
          <div className="story-journey-panel">
            <div className="story-journey-header">
              <h2 id="story-journey-title">Story journey</h2>
              <button
                type="button"
                className="story-journey-close"
                onClick={closeStory}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="story-journey-sub">
              From your dream
              {storyDream.title ? ` “${storyDream.title}”` : ""}. Pick a genre,
              then choose paths to shape the tale.
            </p>

            {!storyGenre ? (
              <div className="genre-grid">
                {GENRES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className="genre-chip"
                    onClick={() => setStoryGenre(g.label)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="story-genre-pill">Genre: {storyGenre}</p>
            )}

            {storyGenre && storyLog.length === 0 && !storyLoading && (
              <button
                type="button"
                className="btn btn-primary story-begin-btn"
                onClick={startStory}
              >
                Begin story
              </button>
            )}

            {storyLoading && (
              <p className="story-loading">Writing…</p>
            )}

            {storyLog.length > 0 && (
              <div className="story-segments">
                {storyLog.map((block, i) => (
                  <div key={i} className="story-segment-block">
                    {block.split("\n").map((line, j) => (
                      <p key={j}>{line}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {storyChoices.length > 0 && !storyLoading && (
              <div className="story-choices">
                <p className="story-choices-label">What happens next?</p>
                <div className="story-choice-buttons">
                  {storyChoices.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn btn-ghost story-choice-btn"
                      onClick={() => continueStory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {storyEnded && storyLog.length > 0 && !storyLoading && (
              <p className="story-the-end">The end — or close and try another path.</p>
            )}

            <div className="story-journey-footer">
              <button type="button" className="btn btn-ghost" onClick={closeStory}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
