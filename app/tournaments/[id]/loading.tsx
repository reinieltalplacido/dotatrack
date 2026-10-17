import { TournamentsSkeleton } from "@/components/tournaments/TournamentsSkeleton";

export default function TournamentDetailLoading() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <main className="flex-1 esports-grid">
        <TournamentsSkeleton />
      </main>
    </div>
  );
}
