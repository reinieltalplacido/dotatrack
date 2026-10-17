import { HeroCompendiumSkeleton } from "@/components/heroes/HeroCompendiumSkeleton";

export default function HeroesLoading() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <main className="flex-1 esports-grid">
        <HeroCompendiumSkeleton />
      </main>
    </div>
  );
}
