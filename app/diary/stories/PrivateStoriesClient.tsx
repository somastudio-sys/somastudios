"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";
import {
  deletePrivateStory,
  loadPrivateStories,
} from "@/lib/privateStoriesStorage";

export default function PrivateStoriesClient() {
  const [stories, setStories] = useState<RepurposedStory[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setStories(loadPrivateStories());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  const handleDelete = (id: string) => {
    if (!confirm("Remove this story from your private collection?")) return;
    deletePrivateStory(id);
    refresh();
  };

  const sorted = [...stories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="private-stories-page">
      <header className="private-stories-header">
        <div className="private-stories-header-inner">
          <Link href="/diary" className="private-stories-back">
            ← Diary
          </Link>
          <h1 className="private-stories-title">My repurposed stories</h1>
          <p className="private-stories-lede">
            Story journeys you’ve saved from your dreams—private to this
            browser, only visible after login.
          </p>
        </div>
      </header>

      <main className="private-stories-main">
        {!mounted ? (
          <p className="private-stories-empty">Loading…</p>
        ) : sorted.length === 0 ? (
          <div className="private-stories-empty">
            <p>No saved stories yet.</p>
            <p className="private-stories-hint">
              From the diary, run a <strong>Story journey</strong> after analysing
              a dream, then use <strong>Save to my stories</strong>.
            </p>
          </div>
        ) : (
          <ul className="private-stories-list">
            {sorted.map((story) => {
              const date = new Date(story.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );
              return (
                <li key={story.id} className="private-stories-card">
                  <header className="private-stories-meta">
                    <h2>{story.title}</h2>
                    <div className="private-stories-sub">
                      <span className="private-stories-genre">{story.genre}</span>
                      <time dateTime={story.createdAt}>{date}</time>
                    </div>
                  </header>
                  <article className="private-stories-body">
                    {story.body.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </article>
                  <div className="private-stories-actions">
                    <button
                      type="button"
                      className="btn btn-ghost private-stories-remove"
                      onClick={() => handleDelete(story.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
