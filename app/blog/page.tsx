import type { Metadata } from "next";
import MarketingBlogClient from "./MarketingBlogClient";

export const metadata: Metadata = {
  title: "Journal | Soma Studios",
  description:
    "Ideas and updates from Soma Studios—dreams, creativity, and building a softer home for what you see at night.",
};

export default function BlogPage() {
  return <MarketingBlogClient />;
}
