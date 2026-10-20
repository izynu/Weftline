import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weftline. An installable skill for agents that build web interfaces",
  description:
    "Weftline is a cross-agent skill for building thoughtful, accessible web interfaces: a five-pass workflow, a motion technique ladder, hard rules against fabricated metrics and decorative styling, and a bundled validation script. MIT licensed, no dependencies.",
  keywords: [
    "Weftline",
    "agent skills",
    "SKILL.md",
    "agentskills.io",
    "coding agents",
    "frontend",
    "accessibility",
    "motion design",
  ],
  authors: [
    { name: "Zynu" },
    { name: "Shraddha" },
  ],
  category: "developer tools",
};

export const viewport: Viewport = {
  themeColor: "#121214",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
