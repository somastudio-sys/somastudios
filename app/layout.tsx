import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Soma Studios — The AI dream analysis app",
    template: "%s | Soma Studios",
  },
  description:
    "Soma Studios is an AI dream journal that analyses your dreams through a Freudian lens — then lets you build them into branching stories you navigate yourself. Private, in your browser.",
  openGraph: {
    type: "website",
    locale: "en",
    siteName: "Soma Studios",
    url: siteUrl,
    images: [
      {
        url: "/assets/soma-studio-logo.png",
        width: 512,
        height: 512,
        alt: "Soma Studios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Soma Studios — The AI dream analysis app",
    description:
      "Soma Studios is an AI dream journal that analyses your dreams through a Freudian lens — then lets you build them into branching stories you navigate yourself.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
