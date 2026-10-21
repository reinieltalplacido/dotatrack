"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090C] text-[#EDEDF0] selection:bg-rose-600 selection:text-white font-sans relative overflow-hidden p-4">
      {/* Ambient tactical lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-950/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Minimal tactical panel */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="tactical-panel corner-tick p-8 sm:p-12 rounded-sm border border-white/[0.08] bg-[#0E1018]/90 backdrop-blur-md shadow-2xl max-w-xl w-full text-center relative z-10 flex flex-col items-center"
      >
        {/* Slumped Pudge Meme Animation */}
        <div className="relative w-60 h-64 sm:w-68 sm:h-72 flex items-center justify-center mb-4">
          {/* Subtle red halo aura */}
          <div className="absolute inset-0 bg-radial from-rose-600/20 via-rose-950/10 to-transparent blur-2xl rounded-full pointer-events-none" />
          
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut" 
            }}
            className="relative w-52 h-60 sm:w-60 sm:h-68 drop-shadow-[0_15px_30px_rgba(225,29,72,0.35)]"
          >
            <Image
              src="/sad-hero.png"
              alt="Sad Slumped Pudge - Mid Dif"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 208px, 240px"
            />
          </motion.div>

          {/* Ground Shadow */}
          <div className="absolute bottom-1 w-44 h-4 bg-black/70 rounded-[100%] blur-sm pointer-events-none" />
        </div>

        {/* 404 Tag */}
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-500 font-semibold mb-2">
          404 // ERROR
        </span>

        {/* "Mid Dif gg end" Heading */}
        <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight uppercase leading-none">
          Mid Dif
        </h1>
        <p className="text-xl sm:text-2xl font-mono text-rose-500 font-extrabold uppercase tracking-wider mt-2 mb-8">
          gg end
        </p>

        {/* Return Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition shadow-lg shadow-rose-950/60 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Return to Base</span>
        </Link>
      </motion.div>
    </div>
  );
}
