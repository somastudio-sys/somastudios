import type { Metadata } from "next";
import DiaryGuard from "../../DiaryGuard";
import PrivateStoryDetailClient from "./PrivateStoryDetailClient";

export const metadata: Metadata = {
  title: "Story | Soma",
  robots: { index: false, follow: false },
};

export default function PrivateStoryPage() {
  return (
    <DiaryGuard>
      <PrivateStoryDetailClient />
    </DiaryGuard>
  );
}
