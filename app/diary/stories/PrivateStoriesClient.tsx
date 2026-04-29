"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";
import {
  deletePrivateStory,
  loadPrivateStories,
} from "@/lib/privateStoriesStorage";

function storyExcerpt(body: string, max = 140): string {
  const line = body.replace(/\s+/g, " ").trim();
  if (line.length <= max) return line;
  return `${line.slice(0, max).trim()}…`;
}

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

  const handleDelete = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
            browser, only visible after login. Open a story to read it in full.
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
          <ul className="private-stories-list private-stories-list-compact">
            {sorted.map((story) => {
              const date = new Date(story.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );
              const href = `/diary/stories/${encodeURIComponent(story.id)}`;
              return (
                <li key={story.id} className="private-stories-row">
                  <Link href={href} className="private-stories-row-link">
                    <h2 className="private-stories-row-title">{story.title}</h2>
                    <div className="private-stories-sub private-stories-row-sub">
                      <span className="private-stories-genre">{story.genre}</span>
                      <time dateTime={story.createdAt}>{date}</time>
                    </div>
                    <p className="private-stories-excerpt">{storyExcerpt(story.body)}</p>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost private-stories-remove private-stories-row-remove"
                    onClick={(e) => handleDelete(story.id, e)}
                    aria-label={`Remove “${story.title}”`}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
