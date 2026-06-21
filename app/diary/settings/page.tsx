import type { Metadata } from "next";
import DiaryGuard from "../DiaryGuard";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings | Soma",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <DiaryGuard>
      <SettingsClient />
    </DiaryGuard>
  );
}
