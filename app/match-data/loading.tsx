import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MatchSkeleton } from "@/components/match/MatchSkeleton";

export default function MatchDataLoading() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 esports-grid">
        <MatchSkeleton />
      </main>
      <Footer />
    </div>
  );
}
