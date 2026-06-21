"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteAllDreamsApi,
  deleteAllStoriesApi,
  fetchDreams,
  fetchSession,
  fetchStories,
} from "@/lib/diaryApi";
import { exportArchivePdf } from "@/lib/exportPdf";

export default function SettingsClient() {
  const [email, setEmail] = useState<string | undefined>();
  const [dreamCount, setDreamCount] = useState<number | null>(null);
  const [storyCount, setStoryCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deletingDreams, setDeletingDreams] = useState(false);
  const [deletingStories, setDeletingStories] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refreshCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [session, dreams, stories] = await Promise.all([
        fetchSession(),
        fetchDreams(),
        fetchStories(),
      ]);
      setEmail(session.email);
      setDreamCount(dreams.length);
      setStoryCount(stories.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  async function handleExport() {
    setExporting(true);
    setMessage(null);
    try {
      const [dreams, stories] = await Promise.all([fetchDreams(), fetchStories()]);
      exportArchivePdf(dreams, stories, email);
      setMessage("PDF download started.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAllDreams() {
    if (dreamCount === 0) return;
    if (
      !confirm(
        "Delete all dreams from your cloud archive? This cannot be undone."
      )
    ) {
      return;
    }
    setDeletingDreams(true);
    setMessage(null);
    setError(null);
    try {
      const deleted = await deleteAllDreamsApi();
      setDreamCount(0);
      setMessage(
        deleted === 0
          ? "No dreams to delete."
          : `Deleted ${deleted} dream${deleted === 1 ? "" : "s"}.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete dreams.");
    } finally {
      setDeletingDreams(false);
    }
  }

  async function handleDeleteAllStories() {
    if (storyCount === 0) return;
    if (
      !confirm(
        "Delete all repurposed stories from your cloud archive? This cannot be undone."
      )
    ) {
      return;
    }
    setDeletingStories(true);
    setMessage(null);
    setError(null);
    try {
      const deleted = await deleteAllStoriesApi();
      setStoryCount(0);
      setMessage(
        deleted === 0
          ? "No stories to delete."
          : `Deleted ${deleted} stor${deleted === 1 ? "y" : "ies"}.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete stories.");
    } finally {
      setDeletingStories(false);
    }
  }

  return (
    <div className="diary-settings-page">
      <header className="diary-settings-header">
        <h1 className="diary-settings-title">Settings</h1>
        <p className="diary-settings-lede">
          Export your archive or permanently remove data from your cloud account.
        </p>
      </header>

      <main className="diary-settings-main">
        {loading ? (
          <p className="diary-settings-muted">Loading…</p>
        ) : (
          <>
            {error ? (
              <p className="diary-settings-error" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="diary-settings-success" role="status">
                {message}
              </p>
            ) : null}

            <section className="diary-settings-card">
              <h2>Export archive</h2>
              <p>
                Download all {dreamCount ?? 0} dream
                {(dreamCount ?? 0) === 1 ? "" : "s"} and {storyCount ?? 0} saved
                stor{(storyCount ?? 0) === 1 ? "y" : "ies"} as a PDF.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleExport}
                disabled={exporting || loading}
              >
                {exporting ? "Preparing PDF…" : "Export full archive (PDF)"}
              </button>
            </section>

            <section className="diary-settings-card diary-settings-card--danger">
              <h2>Delete all dreams</h2>
              <p>
                Permanently remove every dream from your cloud archive. Your
                repurposed stories are not affected.
              </p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAllDreams}
                disabled={deletingDreams || (dreamCount ?? 0) === 0}
              >
                {deletingDreams
                  ? "Deleting…"
                  : `Delete all dreams (${dreamCount ?? 0})`}
              </button>
            </section>

            <section className="diary-settings-card diary-settings-card--danger">
              <h2>Delete all repurposed stories</h2>
              <p>
                Permanently remove every saved story from your cloud archive.
                Your dreams are not affected.
              </p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAllStories}
                disabled={deletingStories || (storyCount ?? 0) === 0}
              >
                {deletingStories
                  ? "Deleting…"
                  : `Delete all stories (${storyCount ?? 0})`}
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
