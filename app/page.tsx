import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PlatformShowcase } from "@/components/PlatformShowcase";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lp-shell bg-[#08090C]">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <PlatformShowcase />
        <FeatureHighlights />
      </main>

      <Footer />
    </div>
  );
}
