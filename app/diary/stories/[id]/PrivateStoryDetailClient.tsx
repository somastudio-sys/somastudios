"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";
import {
  deletePrivateStory,
  getPrivateStoryById,
} from "@/lib/privateStoriesStorage";

export default function PrivateStoryDetailClient() {
  const params = useParams();
  const router = useRouter();
  const rawId = typeof params.id === "string" ? params.id : "";
  const storyId = rawId ? decodeURIComponent(rawId) : "";

  const [story, setStory] = useState<RepurposedStory | null | undefined>(
    undefined
  );
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    if (!storyId) {
      setStory(null);
      return;
    }
    setStory(getPrivateStoryById(storyId));
  }, [storyId]);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (story && story.title) {
      document.title = `${story.title} | Soma`;
    }
  }, [story]);

  const handleDelete = () => {
    if (!story) return;
    if (!confirm("Remove this story from your private collection?")) return;
    deletePrivateStory(story.id);
    router.push("/diary/stories");
  };

  if (!mounted || story === undefined) {
    return (
      <div className="private-stories-page">
        <div className="private-stories-main">
          <p className="private-stories-empty">Loading…</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="private-stories-page">
        <header className="private-stories-header">
          <div className="private-stories-header-inner">
            <Link href="/diary/stories" className="private-stories-back">
              ← All stories
            </Link>
            <h1 className="private-stories-title">Story not found</h1>
            <p className="private-stories-lede">
              This story may have been removed or the link is invalid.
            </p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="private-stories-page">
      <header className="private-stories-header">
        <div className="private-stories-header-inner">
          <Link href="/diary/stories" className="private-stories-back">
            ← All stories
          </Link>
          <div className="private-stories-detail-meta">
            <span className="private-stories-genre">{story.genre}</span>
            <time dateTime={story.createdAt}>
              {new Date(story.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h1 className="private-stories-title private-stories-detail-h1">
            {story.title}
          </h1>
        </div>
      </header>

      <main className="private-stories-main private-stories-detail-main">
        <article className="private-stories-body">
          {story.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
        <div className="private-stories-actions">
          <button
            type="button"
            className="btn btn-ghost private-stories-remove"
            onClick={handleDelete}
          >
            Remove from collection
          </button>
        </div>
      </main>
    </div>
  );
}
