import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MetaSkeleton } from "@/components/meta/MetaSkeleton";

export default function MetaTrendsLoading() {
  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDF0] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 esports-grid">
        <MetaSkeleton />
      </main>
      <Footer />
    </div>
  );
}
