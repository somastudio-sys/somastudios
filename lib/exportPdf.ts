import type { DreamEntry } from "@/app/diary/types";
import type { RepurposedStory } from "@/lib/privateStoriesStorage";
import { jsPDF } from "jspdf";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

export function exportArchivePdf(
  dreams: DreamEntry[],
  stories: RepurposedStory[],
  email?: string
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  const maxWidth = 174;
  let y = 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Soma Dream Archive", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  const exportedAt = new Date().toLocaleString();
  const meta = email
    ? `Exported ${exportedAt} · ${email}`
    : `Exported ${exportedAt}`;
  doc.text(meta, margin, y);
  y += 12;
  doc.setTextColor(0);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Dreams", margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const sortedDreams = [...dreams].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedDreams.length === 0) {
    y = addWrappedText(doc, "No dreams in your archive.", margin, y, maxWidth, 5);
    y += 6;
  } else {
    for (const dream of sortedDreams) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      const title = dream.title || "Untitled dream";
      y = addWrappedText(doc, title, margin, y, maxWidth, 5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      y = addWrappedText(
        doc,
        `Dream date: ${formatDate(dream.date)} · Saved ${formatDate(dream.createdAt)}`,
        margin,
        y,
        maxWidth,
        4.5
      );
      doc.setTextColor(0);
      y += 2;
      y = addWrappedText(doc, dream.content, margin, y, maxWidth, 5);
      if (dream.freudAnalysis) {
        y += 3;
        doc.setFont("helvetica", "bold");
        y = addWrappedText(doc, "Freudian analysis", margin, y, maxWidth, 5);
        doc.setFont("helvetica", "normal");
        y = addWrappedText(doc, dream.freudAnalysis, margin, y, maxWidth, 5);
      }
      y += 8;
    }
  }

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Repurposed stories", margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const sortedStories = [...stories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedStories.length === 0) {
    addWrappedText(doc, "No saved stories in your archive.", margin, y, maxWidth, 5);
  } else {
    for (const story of sortedStories) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      y = addWrappedText(doc, story.title, margin, y, maxWidth, 5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      y = addWrappedText(
        doc,
        `${story.genre} · Saved ${formatDate(story.createdAt)}`,
        margin,
        y,
        maxWidth,
        4.5
      );
      doc.setTextColor(0);
      y += 2;
      y = addWrappedText(doc, story.body, margin, y, maxWidth, 5);
      y += 8;
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`soma-archive-${stamp}.pdf`);
}
