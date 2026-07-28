"use client";

import { useState, useEffect } from "react";
import { Sparkles, Flame, Award, RefreshCw, Heart } from "lucide-react";
import quotes from "@/data/tamil-quotes.json";
import confetti from "canvas-confetti";

interface SplashProps {
  unlocked: number;
  total: number;
  bestStreak: number;
  onEnter: () => void;
}

export function Splash({ unlocked, total, bestStreak, onEnter }: SplashProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const currentQuote = quotes[quoteIndex] || quotes[0];

  const handleNextQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleOpen = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#e0578a", "#c8a8e9", "#d6336c", "#fff5f7", "#ffc8df"],
    });
    onEnter();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#fff5f7] via-[#fceef4] to-[#f8e5ed] relative overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#fbe2ec] rounded-full filter blur-3xl opacity-60 animate-pulse -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ede4fa] rounded-full filter blur-3xl opacity-60 animate-pulse -z-10" />

      {/* Challenge Title Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fde3ec] border border-[#f0c4d4] text-[#d6336c] text-xs font-semibold tracking-wide uppercase mb-4 shadow-sm">
        <Heart className="w-3.5 h-3.5 fill-[#d6336c]" /> 1% Better Everyday Challenge
      </div>

      <div className="text-5xl animate-bounce my-2">🌸</div>
      <h1 className="font-fraunces italic text-4xl sm:text-5xl font-bold text-[#7a2348] mt-2">
        Suvii Diary
      </h1>
      <p className="text-sm text-[#a9607f] tracking-widest uppercase mt-1 mb-6">
        your personal glow-up companion
      </p>

      {/* Motivational Tamil Quote Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-xl shadow-[#d6336c]/10 border border-[#f6d9e3] max-w-md w-full my-3 transition-all transform hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#a9607f]">
            Tamil Wisdom #{currentQuote.id}
          </span>
          <button
            onClick={handleNextQuote}
            className="text-xs text-[#d6336c] hover:text-[#e0578a] flex items-center gap-1 font-medium transition-colors cursor-pointer"
            title="Show another quote"
          >
            <RefreshCw className="w-3 h-3" /> Next quote
          </button>
        </div>
        <div className="font-fraunces text-xl sm:text-2xl text-[#7a2348] font-semibold leading-relaxed">
          &ldquo;{currentQuote.ta}&rdquo;
        </div>
        <div className="text-sm font-semibold text-[#e0578a] mt-3 italic">
          &ldquo;{currentQuote.en}&rdquo;
        </div>
        <div className="text-xs text-[#b06d86] mt-2 pt-2 border-t border-[#f6d9e3]">
          {currentQuote.meaning}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap justify-center gap-3 my-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a2348] bg-white/90 px-4 py-2 rounded-full border border-[#f6d9e3] shadow-sm">
          <Flame className="w-4 h-4 text-[#e0578a] fill-[#e0578a]" />
          Best streak: <span className="text-[#d6336c]">{bestStreak}d</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#7a2348] bg-white/90 px-4 py-2 rounded-full border border-[#f6d9e3] shadow-sm">
          <Award className="w-4 h-4 text-[#8e62c6]" />
          Badges: <span className="text-[#8e62c6]">{unlocked}/{total}</span>
        </div>
      </div>

      {/* Open Button */}
      <button
        onClick={handleOpen}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#e0578a] to-[#c8a8e9] hover:from-[#d6336c] hover:to-[#b791e2] text-white font-bold px-8 py-4 rounded-full text-base shadow-lg shadow-[#e0578a]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
        Open my diary
      </button>
    </div>
  );
}
