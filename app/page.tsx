import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PlatformShowcase } from "@/components/PlatformShowcase";
import { PipelineArchitecture } from "@/components/PipelineArchitecture";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#08090C] text-[#EDEDF0]">
      <Navbar />

      <main className="flex-1">
        <Hero />
        <PlatformShowcase />
        <PipelineArchitecture />
      </main>

      <Footer />
    </div>
  );
}
