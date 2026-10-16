import type { Metadata } from "next";
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
  title: "DotaTrack — Dota 2 Player Analytics & Match Tracker",
  description:
    "Track your Dota 2 match history, win rates, KDA, hero performance, and progression trends with high-precision analytics.",
  keywords: ["Dota 2", "Dota stats", "player tracker", "OpenDota", "match history", "winrate", "KDA", "esports analytics"],
  authors: [{ name: "DotaTrack Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#090A0F] text-[#F1F3F7] antialiased selection:bg-rose-600 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
