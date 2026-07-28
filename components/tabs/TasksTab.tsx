"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Check,
  Clock,
  Calendar as CalendarIcon,
  Repeat,
  Volume2,
} from "lucide-react";
import { TaskItem } from "../types";

interface TasksTabProps {
  tasks: TaskItem[];
  onAddTask: (
    title: string,
    date: string,
    time: string,
    repeat: "none" | "daily" | "weekly"
  ) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onToggleTask: (id: string, done: boolean) => Promise<void>;
}

export function TasksTab({
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleTask,
}: TasksTabProps) {
  const validTasks = Array.isArray(tasks) ? tasks : [];
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("09:00");
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [notifPermission, setNotifPermission] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    // Interval checker every minute
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 5);

      tasks.forEach((t) => {
        if (!t.done && !t.notified && t.date === todayStr && t.time <= timeStr) {
          // Trigger browser notification
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification(`🌸 Suvii Reminder: ${t.title}`, {
              body: `It's ${t.time}! Time to achieve your goals today ✨`,
              icon: "/favicon.ico",
            });
          }
        }
      });

      // Also trigger check-tasks cron route silently
      fetch("/api/cron/check-tasks", { method: "POST" }).catch(() => {});
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  const requestNotifPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAddTask(title.trim(), date, time, repeat);
    setTitle("");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-fraunces italic text-2xl font-bold text-[#7a2348]">
            Tasks & Reminders ⏰
          </h2>
          <p className="text-xs text-[#a9607f]">
            Set daily or weekly reminders. You&apos;ll get notified on screen and via email!
          </p>
        </div>

        {/* Browser notification permission banner */}
        {notifPermission !== "granted" && (
          <button
            onClick={requestNotifPermission}
            className="flex items-center gap-2 bg-[#fde3ec] border border-[#f0c4d4] hover:bg-[#fbd3e1] text-[#d6336c] px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Bell className="w-4 h-4" /> Turn on browser alarms
          </button>
        )}
      </div>

      {/* Add Task Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-[#f6d9e3] shadow-sm space-y-3"
      >
        <div className="text-xs font-bold text-[#7a2348] uppercase tracking-wider">
          + Schedule new reminder
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="What needs to be done? (e.g. Drink water, Study Tamil...)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348]"
            />
          </div>
          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348]"
            />
          </div>
          <div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none focus:border-[#e0578a] text-[#7a2348]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7a2348]">
            <Repeat className="w-4 h-4 text-[#e0578a]" />
            <span>Repeat:</span>
            <select
              value={repeat}
              onChange={(e) =>
                setRepeat(e.target.value as "none" | "daily" | "weekly")
              }
              className="px-3 py-1.5 rounded-lg border border-[#f0c4d4] text-xs bg-white outline-none"
            >
              <option value="none">None (One time)</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#e0578a] to-[#d6336c] hover:opacity-90 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Save Reminder
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {validTasks.length === 0 ? (
          <div className="bg-white/70 p-8 rounded-2xl border border-[#f6d9e3] text-center text-sm text-[#a9607f]">
            No reminders scheduled yet. Add one above! 🌸
          </div>
        ) : (
          validTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onToggleTask(t.id, !t.done)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                t.done
                  ? "bg-[#f7f3fd]/50 border-[#8e62c6]/30 opacity-75"
                  : "bg-white/90 border-[#f6d9e3] hover:shadow-sm"
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
                  <div className="flex items-center gap-3 text-xs text-[#a9607f] mt-0.5">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" /> {t.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {t.time}
                    </span>
                    {t.repeat !== "none" && (
                      <span className="bg-[#fde3ec] text-[#d6336c] px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                        {t.repeat}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await onDeleteTask(t.id);
                }}
                className="p-2 text-[#c98aa3] hover:text-[#d6336c] rounded-full transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
