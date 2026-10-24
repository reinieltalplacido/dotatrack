import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LearnDashboard } from "@/components/learn/LearnDashboard";

export const metadata: Metadata = {
  title: "Learn Dota 2 — Attributes, Item Counters & Mechanics | DotaTrack",
  description:
    "Comprehensive Dota 2 learning hub. Master Strength, Agility, Intelligence, and Universal attributes, interactive item counter matrix, dispel hierarchies, and map objective timings.",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 esports-grid">
        <LearnDashboard />
      </main>
      <Footer />
    </div>
  );
}
