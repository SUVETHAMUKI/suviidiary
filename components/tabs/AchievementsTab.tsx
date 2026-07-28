"use client";

import { Award, Lock, Sparkles, Heart } from "lucide-react";
import { AchievementItem } from "../types";

interface AchievementsTabProps {
  achievements: AchievementItem[];
}

export function AchievementsTab({ achievements }: AchievementsTabProps) {
  const validAchievements = Array.isArray(achievements) ? achievements : [];
  const unlockedCount = validAchievements.filter((a) => a.need).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-fraunces italic text-2xl font-bold text-[#7a2348]">
            Badges & Achievements 🏆
          </h2>
          <p className="text-xs text-[#a9607f]">
            Earn badges automatically as you check off habits, complete reminders, log moods, and save money!
          </p>
        </div>

        <div className="bg-white/90 px-4 py-2 rounded-2xl border border-[#f6d9e3] shadow-sm flex items-center gap-2">
          <Award className="w-5 h-5 text-[#e69b24]" />
          <span className="text-sm font-bold text-[#7a2348]">
            Unlocked: <span className="text-[#e0578a]">{unlockedCount}</span> /{" "}
            {validAchievements.length}
          </span>
        </div>
      </div>

      {/* Tamil Motivational Slogan Pill */}
      <div className="bg-gradient-to-r from-[#e0578a] via-[#d6336c] to-[#8e62c6] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20">
          🌸
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/90 mb-1">
          <Heart className="w-4 h-4 fill-white" /> Tamil Slogan of Victory
        </div>
        <div className="font-fraunces text-2xl sm:text-3xl font-bold italic leading-relaxed">
          &ldquo;முயற்சி திருவினையாக்கும்&rdquo;
        </div>
        <div className="text-sm text-white/95 mt-1 font-semibold">
          &ldquo;Effort yields great reward & prosperity&rdquo; — Thirukkural
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {validAchievements.map((a) => {
          const unlocked = a.need;
          return (
            <div
              key={a.id}
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                unlocked
                  ? "bg-gradient-to-b from-white to-[#fff0f5] border-[#e0578a] shadow-md shadow-[#e0578a]/10 hover:-translate-y-1"
                  : "bg-white/60 border-[#f6d9e3] opacity-60 hover:opacity-80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{a.icon || "🌸"}</span>
                  {unlocked ? (
                    <span className="bg-[#fde3ec] text-[#d6336c] px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="font-fraunces italic text-lg font-bold text-[#7a2348]">
                  {a.label}
                </h3>
                <p className="text-xs text-[#a9607f] mt-1">{a.hint}</p>
              </div>

              {unlocked && (
                <div className="mt-4 pt-3 border-t border-[#f6d9e3] text-[11px] font-semibold text-[#3aa77c] flex items-center gap-1">
                  ✓ Achieved in Suvii Diary
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
