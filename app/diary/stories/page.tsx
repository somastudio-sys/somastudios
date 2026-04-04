import type { Metadata } from "next";
import DiaryGuard from "../DiaryGuard";
import PrivateStoriesClient from "./PrivateStoriesClient";

export const metadata: Metadata = {
  title: "My repurposed stories | Soma",
  robots: { index: false, follow: false },
};

export default function PrivateStoriesPage() {
  return (
    <DiaryGuard>
      <PrivateStoriesClient />
    </DiaryGuard>
  );
}
