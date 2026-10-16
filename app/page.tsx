import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { HowItWorks } from "@/components/HowItWorks";
import { HeroesSection } from "@/components/HeroesSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#F1F3F7]">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <FeatureHighlights />
        <HowItWorks />
        <HeroesSection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
