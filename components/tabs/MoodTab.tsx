"use client";

import { useState } from "react";
import { Smile, Calendar, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { MoodLogItem } from "../types";

interface MoodTabProps {
  moodLogs: MoodLogItem[];
  onLogMood: (date: string, mood: string, note?: string) => Promise<void>;
}

const MOODS: Record<
  string,
  { emoji: string; label: string; color: string; bg: string }
> = {
  happy: {
    emoji: "😊",
    label: "Happy",
    color: "#d6336c",
    bg: "#fde3ec",
  },
  grateful: {
    emoji: "🥰",
    label: "Grateful",
    color: "#e0578a",
    bg: "#fff0f5",
  },
  blank: {
    emoji: "😐",
    label: "Blank",
    color: "#6c757d",
    bg: "#f8f9fa",
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    color: "#8e62c6",
    bg: "#ede4fa",
  },
  stressed: {
    emoji: "😖",
    label: "Stressed",
    color: "#e68a00",
    bg: "#fef5e7",
  },
  upset: {
    emoji: "😔",
    label: "Upset/Sad",
    color: "#4d73b8",
    bg: "#eef4fd",
  },
  jealous: {
    emoji: "😒",
    label: "Jealous",
    color: "#718096",
    bg: "#edf2f7",
  },
};

export function MoodTab({ moodLogs, onLogMood }: MoodTabProps) {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [selectedMood, setSelectedMood] = useState("happy");
  const [note, setNote] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const validLogs = Array.isArray(moodLogs) ? moodLogs : [];
  const logMap = new Map(validLogs.map((l) => [l.date, l]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogMood(selectedDate, selectedMood, note.trim());
    setNote("");
  };

  // Find most frequent mood this month
  const moodCounts: Record<string, number> = {};
  validLogs.forEach((l) => {
    if (l.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)) {
      moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
    }
  });

  let topMood = "happy";
  let maxCount = 0;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topMood = m;
    }
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-fraunces italic text-2xl font-bold text-[#7a2348]">
            Mood Tracker & Monthly Calendar 🌸
          </h2>
          <p className="text-xs text-[#a9607f]">
            One mood entry per day with optional notes. Notice your emotional rhythm!
          </p>
        </div>

        {/* Top Mood Pill */}
        <div className="bg-white/90 px-4 py-2 rounded-2xl border border-[#f6d9e3] shadow-sm flex items-center gap-2">
          <span className="text-xs font-bold text-[#7a2348]">
            This month&apos;s vibe:
          </span>
          <span className="text-lg">{MOODS[topMood]?.emoji || "😊"}</span>
          <span className="text-xs font-bold text-[#d6336c]">
            {MOODS[topMood]?.label || "Happy"} ({maxCount} days)
          </span>
        </div>
      </div>

      {/* Log Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-[#f6d9e3] shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#7a2348]">
            Log mood for:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 rounded-xl border border-[#f0c4d4] text-xs font-semibold text-[#7a2348] outline-none"
          />
        </div>

        {/* Emoji Selector */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {Object.entries(MOODS).map(([key, item]) => {
            const active = selectedMood === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedMood(key)}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? "bg-[#fde3ec] border-[#e0578a] shadow-sm scale-105"
                    : "bg-[#fff5f7]/60 border-[#f6d9e3] hover:bg-[#fff0f5]"
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-bold text-[#7a2348]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Note & Submit */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a little note about your day (optional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348]"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#e0578a] to-[#d6336c] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            Save Mood
          </button>
        </div>
      </form>

      {/* Monthly Calendar View */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-[#f6d9e3] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-fraunces italic text-lg font-bold text-[#7a2348]">
            {monthName} Calendar
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-1 rounded-xl hover:bg-[#fff5f7] text-[#7a2348] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-1 rounded-xl hover:bg-[#fff5f7] text-[#7a2348] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#a9607f]">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 min-h-[60px]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const log = logMap.get(dateStr);
            const isToday = dateStr === new Date().toISOString().slice(0, 10);

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center min-h-[60px] transition-all cursor-pointer ${
                  isToday
                    ? "border-2 border-[#e0578a] bg-[#fff0f5]"
                    : "border-[#f6d9e3] hover:bg-[#fff5f7]"
                }`}
                title={log?.note ? `Note: ${log.note}` : `Day ${dayNum}`}
              >
                <span className="text-[10px] font-bold text-[#a9607f] self-start">
                  {dayNum}
                </span>
                <span className="text-xl my-1">
                  {log ? MOODS[log.mood]?.emoji || "😊" : "·"}
                </span>
                {log?.note && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e0578a]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
