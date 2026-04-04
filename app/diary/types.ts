export type DreamEntry = {
  id: string;
  date: string;
  title?: string;
  content: string;
  createdAt: string;
  freudAnalysis?: string;
  analyzedAt?: string;
};

export const STORAGE_KEY = "dream-diary-entries";
