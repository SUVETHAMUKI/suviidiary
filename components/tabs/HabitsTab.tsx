"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Flame,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HabitItem } from "../types";

interface HabitsTabProps {
  habits: HabitItem[];
  onAddHabit: (name: string, category: string) => Promise<void>;
  onDeleteHabit: (id: string) => Promise<void>;
  onToggleHabit: (habitId: string, date: string) => Promise<void>;
}

export function HabitsTab({
  habits,
  onAddHabit,
  onDeleteHabit,
  onToggleHabit,
}: HabitsTabProps) {
  const validHabits = Array.isArray(habits) ? habits : [];
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitCat, setNewHabitCat] = useState("Morning Glow ✨");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const categories = [
    "Morning Glow ✨",
    "Fitness & Yoga 🧘‍♀️",
    "Study / Work 📚",
    "Skin Care 🌸",
    "Mindfulness 🥰",
    "Health & Diet 🥗",
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    return { dayNum, dateStr };
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    await onAddHabit(newHabitName.trim(), newHabitCat);
    setNewHabitName("");
  };

  const getStreak = (habit: HabitItem) => {
    const doneDates = new Set(
      Object.entries(habit.checks || {})
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k)
    );
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dt = new Date(d);
      dt.setDate(dt.getDate() - i);
      const str = dt.toISOString().slice(0, 10);
      if (doneDates.has(str)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  const getMonthlyPercentage = (habit: HabitItem) => {
    let checkedCount = 0;
    daysArray.forEach(({ dateStr }) => {
      if (habit.checks?.[dateStr]) checkedCount++;
    });
    return Math.round((checkedCount / daysInMonth) * 100);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Title & Month selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-fraunces italic text-2xl font-bold text-[#7a2348]">
            Habit Tracker & Month Grid 🌸
          </h2>
          <p className="text-xs text-[#a9607f]">
            Check off your habits each day to build streaks and level up your glow-up!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-[#f6d9e3] shadow-sm">
          <button
            onClick={() =>
              setCurrentMonth(new Date(year, month - 1, 1))
            }
            className="p-1 rounded-xl hover:bg-[#fff5f7] text-[#7a2348] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-fraunces italic text-base font-bold text-[#7a2348] px-3">
            {monthName}
          </span>
          <button
            onClick={() =>
              setCurrentMonth(new Date(year, month + 1, 1))
            }
            className="p-1 rounded-xl hover:bg-[#fff5f7] text-[#7a2348] cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-[#f6d9e3] shadow-sm flex flex-wrap gap-3 items-center"
      >
        <input
          type="text"
          placeholder="New habit name (e.g., Read 15 mins, Tamil Slogans, Water...)"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348] font-medium placeholder:text-[#c98aa3]"
        />
        <select
          value={newHabitCat}
          onChange={(e) => setNewHabitCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348] font-medium bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-gradient-to-r from-[#e0578a] to-[#d6336c] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </form>

      {/* Daily Checkbox Grid per Month */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#f6d9e3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#fff5f7] border-b border-[#f6d9e3]">
                <th className="p-3 text-xs font-bold text-[#7a2348] min-w-[180px] sticky left-0 bg-[#fff5f7] z-10 shadow-r">
                  Habit Name
                </th>
                <th className="p-2 text-center text-xs font-bold text-[#d6336c] w-20">
                  Streak
                </th>
                <th className="p-2 text-center text-xs font-bold text-[#8e62c6] w-24">
                  Month %
                </th>
                {daysArray.map(({ dayNum }) => (
                  <th
                    key={dayNum}
                    className="p-1 text-center text-[10px] sm:text-xs font-bold text-[#a9607f] w-7"
                  >
                    {dayNum}
                  </th>
                ))}
                <th className="p-2 w-10 text-center text-xs font-bold text-[#a9607f]">
                  Del
                </th>
              </tr>
            </thead>
            <tbody>
              {validHabits.length === 0 ? (
                <tr>
                  <td
                    colSpan={daysInMonth + 4}
                    className="text-center py-8 text-sm text-[#a9607f]"
                  >
                    No habits created yet. Use the form above to add your first habit! 🌸
                  </td>
                </tr>
              ) : (
                validHabits.map((h) => {
                  const streak = getStreak(h);
                  const pct = getMonthlyPercentage(h);
                  return (
                    <tr
                      key={h.id}
                      className="border-b border-[#f6d9e3]/60 hover:bg-[#fff9fb] transition-colors"
                    >
                      <td className="p-3 font-semibold text-sm text-[#7a2348] sticky left-0 bg-white z-10 shadow-r">
                        <div>{h.name}</div>
                        <div className="text-[10px] text-[#d6336c] font-normal">
                          {h.category}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#e0578a] bg-[#fde3ec] px-2 py-0.5 rounded-full">
                          <Flame className="w-3 h-3 fill-[#e0578a]" />
                          {streak}d
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-[#8e62c6]">
                            {pct}%
                          </span>
                          <div className="w-12 bg-[#ede4fa] rounded-full h-1.5 mt-0.5 overflow-hidden">
                            <div
                              className="bg-[#8e62c6] h-1.5 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      {daysArray.map(({ dateStr, dayNum }) => {
                        const checked = Boolean(h.checks?.[dateStr]);
                        return (
                          <td key={dayNum} className="p-1 text-center">
                            <button
                              onClick={() => onToggleHabit(h.id, dateStr)}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                                checked
                                  ? "bg-[#e0578a] text-white shadow-xs"
                                  : "bg-[#fff5f7] border border-[#f0c4d4]/60 hover:border-[#e0578a]"
                              }`}
                              title={`${h.name} on ${dateStr}`}
                            >
                              {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          </td>
                        );
                      })}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => onDeleteHabit(h.id)}
                          className="p-1 text-[#c98aa3] hover:text-[#d6336c] rounded-full transition-colors cursor-pointer"
                          title="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
