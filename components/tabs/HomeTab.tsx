"use client";

import {
  ListChecks,
  Bell,
  Wallet,
  Award,
  Check,
  Flame,
  Plus,
  Smile,
} from "lucide-react";
import { HabitItem, TaskItem, MoneyEntryItem } from "../types";

interface HomeTabProps {
  habits: HabitItem[];
  tasks: TaskItem[];
  moneyEntries: MoneyEntryItem[];
  today: string;
  remaining: number;
  unlockedCount: number;
  totalAchievements: number;
  onToggleHabit: (habitId: string, date: string) => Promise<void>;
  onToggleTask: (id: string, done: boolean) => Promise<void>;
  onNavigateTab: (tab: string) => void;
  todayMood?: string;
  onSelectTodayMood: (mood: string) => Promise<void>;
}

const MOOD_EMOJIS: Record<string, { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "Happy" },
  blank: { emoji: "😐", label: "Blank" },
  upset: { emoji: "😔", label: "Upset/Sad" },
  stressed: { emoji: "😖", label: "Stressed" },
  tired: { emoji: "😴", label: "Tired" },
  jealous: { emoji: "😒", label: "Jealous" },
  grateful: { emoji: "🥰", label: "Grateful" },
};

export function HomeTab({
  habits,
  tasks,
  today,
  remaining,
  unlockedCount,
  totalAchievements,
  onToggleHabit,
  onToggleTask,
  onNavigateTab,
  todayMood,
  onSelectTodayMood,
}: HomeTabProps) {
  const validHabits = Array.isArray(habits) ? habits : [];
  const validTasks = Array.isArray(tasks) ? tasks : [];
  const todayTasks = validTasks.filter((t) => t.date === today);
  const doneToday = validHabits.filter((h) => h.checks?.[today]).length;

  const fmtMoney = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  return (
    <div className="p-4 sm:p-5 space-y-6 animate-fade-in">
      {/* Today's Glow Stat Cards */}
      <div>
        <h2 className="font-fraunces italic text-lg sm:text-xl font-bold text-[#7a2348] mb-3">
          Today&apos;s glow ✨
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => onNavigateTab("habits")}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-[#f6d9e3] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#fde3ec] flex items-center justify-center mx-auto mb-2">
              <ListChecks className="w-4 h-4 text-[#e0578a]" />
            </div>
            <div className="text-xl font-bold text-[#7a2348]">
              {doneToday} / {validHabits.length || 0}
            </div>
            <div className="text-xs text-[#a9607f]">Habits today</div>
          </div>

          <div
            onClick={() => onNavigateTab("tasks")}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-[#f6d9e3] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#f7f3fd] flex items-center justify-center mx-auto mb-2">
              <Bell className="w-4 h-4 text-[#8e62c6]" />
            </div>
            <div className="text-xl font-bold text-[#7a2348]">
              {todayTasks.filter((t) => t.done).length} / {todayTasks.length}
            </div>
            <div className="text-xs text-[#a9607f]">Tasks today</div>
          </div>

          <div
            onClick={() => onNavigateTab("money")}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-[#f6d9e3] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#e8faf2] flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-4 h-4 text-[#3aa77c]" />
            </div>
            <div className="text-xl font-bold text-[#7a2348]">
              {fmtMoney(remaining)}
            </div>
            <div className="text-xs text-[#a9607f]">Balance</div>
          </div>

          <div
            onClick={() => onNavigateTab("achievements")}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center border border-[#f6d9e3] shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#fef5e7] flex items-center justify-center mx-auto mb-2">
              <Award className="w-4 h-4 text-[#e69b24]" />
            </div>
            <div className="text-xl font-bold text-[#7a2348]">
              {unlockedCount} / {totalAchievements}
            </div>
            <div className="text-xs text-[#a9607f]">Badges</div>
          </div>
        </div>
      </div>

      {/* Quick Mood Selector for Today */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-[#f6d9e3] shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-[#e0578a]" />
            <h3 className="font-fraunces italic text-base font-bold text-[#7a2348]">
              How are you feeling today?
            </h3>
          </div>
          {todayMood && (
            <span className="text-xs text-[#d6336c] font-semibold">
              {MOOD_EMOJIS[todayMood]?.emoji} {MOOD_EMOJIS[todayMood]?.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {Object.entries(MOOD_EMOJIS).map(([key, item]) => {
            const active = todayMood === key;
            return (
              <button
                key={key}
                onClick={() => onSelectTodayMood(key)}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  active
                    ? "bg-[#fde3ec] border-[#e0578a] shadow-sm scale-105"
                    : "bg-[#fff5f7]/60 border-[#f6d9e3] hover:bg-[#fff0f5]"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-[11px] text-[#7a2348] font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Habits Checklist */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-fraunces italic text-lg sm:text-xl font-bold text-[#7a2348]">
            Today&apos;s habits checklist
          </h2>
          <button
            onClick={() => onNavigateTab("habits")}
            className="text-xs font-semibold text-[#d6336c] hover:underline cursor-pointer"
          >
            View month grid →
          </button>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-[#f6d9e3] shadow-sm space-y-2">
          {validHabits.length === 0 ? (
            <p className="text-xs text-[#a9607f] text-center py-4">
              No habits yet — add some from the Habits tab 🌱
            </p>
          ) : (
            validHabits.map((h) => {
              const isChecked = Boolean(h.checks?.[today]);
              return (
                <div
                  key={h.id}
                  onClick={() => onToggleHabit(h.id, today)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-[#fde3ec]/60 border-[#e0578a]/40"
                      : "bg-white border-[#f6d9e3] hover:bg-[#fff5f7]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-[#e0578a] border-[#e0578a] text-white"
                          : "border-[#e8b8ca]"
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isChecked
                          ? "line-through text-[#a9607f]"
                          : "text-[#7a2348]"
                      }`}
                    >
                      {h.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#d6336c] bg-[#fff5f7] px-2.5 py-0.5 rounded-full border border-[#f6d9e3]">
                    {h.category || "Habit"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-fraunces italic text-lg sm:text-xl font-bold text-[#7a2348]">
            Today&apos;s tasks & reminders
          </h2>
          <button
            onClick={() => onNavigateTab("tasks")}
            className="text-xs font-semibold text-[#8e62c6] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Manage tasks
          </button>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-[#f6d9e3] shadow-sm space-y-2">
          {todayTasks.length === 0 ? (
            <div className="text-center py-6 text-[#a9607f]">
              <p className="text-sm font-semibold text-[#7a2348] mb-1">
                No tasks scheduled for today ✨
              </p>
              <p className="text-xs">
                You can add reminders or daily alarms in the Tasks tab.
              </p>
            </div>
          ) : (
            todayTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask(t.id, !t.done)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  t.done
                    ? "bg-[#f7f3fd]/50 border-[#8e62c6]/30 opacity-70"
                    : "bg-white border-[#f6d9e3] hover:bg-[#fff5f7]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      t.done
                        ? "bg-[#8e62c6] border-[#8e62c6] text-white"
                        : "border-[#e8b8ca]"
                    }`}
                  >
                    {t.done && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        t.done
                          ? "line-through text-[#a9607f]"
                          : "text-[#7a2348]"
                      }`}
                    >
                      {t.title}
                    </div>
                    <div className="text-xs text-[#a9607f]">
                      ⏰ {t.time} {t.repeat !== "none" ? `· ${t.repeat}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
