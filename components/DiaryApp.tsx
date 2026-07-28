"use client";

import { useState, useEffect } from "react";
import { Splash } from "./Splash";
import { Header } from "./Header";
import { NavBar } from "./NavBar";
import { MiniPlayer, SongItem } from "./MiniPlayer";
import { HomeTab } from "./tabs/HomeTab";
import { HabitsTab } from "./tabs/HabitsTab";
import { TasksTab } from "./tabs/TasksTab";
import { MoodTab } from "./tabs/MoodTab";
import { MoneyTab } from "./tabs/MoneyTab";
import { AchievementsTab } from "./tabs/AchievementsTab";
import { SettingsTab } from "./tabs/SettingsTab";
import {
  HabitItem,
  TaskItem,
  MoodLogItem,
  MoneyEntryItem,
  AchievementItem,
  UserSettings,
} from "./types";
import defaultSongs from "@/data/default-songs.json";

export function DiaryApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState("home");

  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLogItem[]>([]);
  const [moneyEntries, setMoneyEntries] = useState<MoneyEntryItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [songs, setSongs] = useState<SongItem[]>(defaultSongs);
  const [settings, setSettings] = useState<UserSettings>({
    savingsGoal: 5000,
    bgImage: null,
  });

  const today = new Date().toISOString().slice(0, 10);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [hRes, tRes, moRes, mnRes, aRes, sRes, stRes] = await Promise.all([
        fetch("/api/habits"),
        fetch("/api/tasks"),
        fetch("/api/mood"),
        fetch("/api/money"),
        fetch("/api/achievements"),
        fetch("/api/songs"),
        fetch("/api/settings"),
      ]);

      if (hRes.ok) {
        const hData = await hRes.json();
        if (Array.isArray(hData)) setHabits(hData);
      }
      if (tRes.ok) {
        const tData = await tRes.json();
        if (Array.isArray(tData)) setTasks(tData);
      }
      if (moRes.ok) {
        const moData = await moRes.json();
        setMoodLogs(
          Array.isArray(moData)
            ? moData
            : Array.isArray(moData?.history)
            ? moData.history
            : []
        );
      }
      if (mnRes.ok) {
        const mnData = await mnRes.json();
        if (Array.isArray(mnData)) setMoneyEntries(mnData);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        if (Array.isArray(aData)) setAchievements(aData);
      }
      if (sRes.ok) {
        const fetchedSongs = await sRes.json();
        if (Array.isArray(fetchedSongs) && fetchedSongs.length > 0) {
          setSongs(fetchedSongs);
        }
      }
      if (stRes.ok) {
        const st = await stRes.json();
        setSettings({
          savingsGoal: st.savingsGoal || 5000,
          bgImage: st.bgImage || null,
          notifEnabled: st.notifEnabled || false,
        });
      }
    } catch (err) {
      console.error("Error fetching diary data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute stats
  const unlockedCount = achievements.filter((a) => a.need).length;
  const bestStreak = habits.reduce((max, h) => {
    const doneDates = new Set(
      Object.entries(h.checks || {})
        .filter(([, v]) => Boolean(v))
        .map(([k]) => k)
    );
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dt = new Date(d);
      dt.setDate(dt.getDate() - i);
      const str = dt.toISOString().slice(0, 10);
      if (doneDates.has(str)) streak++;
      else if (i > 0) break;
    }
    return Math.max(max, streak);
  }, 0);

  const totalIncome = moneyEntries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpense = moneyEntries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const remaining = totalIncome - totalExpense;

  const todayMoodLog = Array.isArray(moodLogs)
    ? moodLogs.find((l) => l.date === today)
    : undefined;

  // Handlers
  const handleToggleHabit = async (habitId: string, date: string) => {
    const res = await fetch("/api/habits/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, date }),
    });
    if (res.ok) await fetchData();
  };

  const handleAddHabit = async (name: string, category: string) => {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category }),
    });
    if (res.ok) await fetchData();
  };

  const handleDeleteHabit = async (id: string) => {
    const res = await fetch(`/api/habits?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleAddTask = async (
    title: string,
    date: string,
    time: string,
    repeat: "none" | "daily" | "weekly"
  ) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, time, repeat }),
    });
    if (res.ok) await fetchData();
  };

  const handleToggleTask = async (id: string, done: boolean) => {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done }),
    });
    if (res.ok) await fetchData();
  };

  const handleDeleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleLogMood = async (date: string, mood: string, note?: string) => {
    const res = await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, mood, note }),
    });
    if (res.ok) await fetchData();
  };

  const handleAddMoneyEntry = async (
    type: "income" | "expense",
    category: string,
    amount: number,
    date: string,
    note?: string
  ) => {
    const res = await fetch("/api/money", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, category, amount, date, note }),
    });
    if (res.ok) await fetchData();
  };

  const handleDeleteMoneyEntry = async (id: string) => {
    const res = await fetch(`/api/money?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleAddSong = async (title: string, artist: string, url: string) => {
    const res = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist, url }),
    });
    if (res.ok) await fetchData();
  };

  const handleDeleteSong = async (id: string) => {
    const res = await fetch(`/api/songs?id=${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const handleUpdateSettings = async (newSettings: Partial<UserSettings>) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
    if (res.ok) await fetchData();
  };

  if (showSplash) {
    return (
      <Splash
        unlocked={unlockedCount}
        total={achievements.length || 8}
        bestStreak={bestStreak}
        onEnter={() => setShowSplash(false)}
      />
    );
  }

  // Check if custom background wallpaper is set
  const wallpaperStyle = settings.bgImage
    ? {
        backgroundImage: `url(${settings.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {};

  return (
    <div
      style={wallpaperStyle}
      className="min-h-screen flex flex-col bg-gradient-to-b from-[#fff5f7] via-[#fceef4] to-[#f8e5ed] relative text-[#5c2138]"
    >
      {/* Semi-transparent backdrop overlay when wallpaper is set so text remains readable! */}
      {settings.bgImage && (
        <div className="absolute inset-0 bg-[#fff5f7]/85 backdrop-blur-xs -z-0" />
      )}

      <div className="flex-1 flex flex-col z-10">
        <Header remaining={remaining} onHome={() => setTab("home")} />

        <main className="flex-1 pb-24">
          {tab === "home" && (
            <HomeTab
              habits={habits}
              tasks={tasks}
              moneyEntries={moneyEntries}
              today={today}
              remaining={remaining}
              unlockedCount={unlockedCount}
              totalAchievements={achievements.length || 8}
              onToggleHabit={handleToggleHabit}
              onToggleTask={handleToggleTask}
              onNavigateTab={setTab}
              todayMood={todayMoodLog?.mood}
              onSelectTodayMood={(m) => handleLogMood(today, m)}
            />
          )}

          {tab === "habits" && (
            <HabitsTab
              habits={habits}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
              onToggleHabit={handleToggleHabit}
            />
          )}

          {tab === "tasks" && (
            <TasksTab
              tasks={tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
            />
          )}

          {tab === "mood" && (
            <MoodTab moodLogs={moodLogs} onLogMood={handleLogMood} />
          )}

          {tab === "money" && (
            <MoneyTab
              entries={moneyEntries}
              savingsGoal={settings.savingsGoal || 5000}
              onAddEntry={handleAddMoneyEntry}
              onDeleteEntry={handleDeleteMoneyEntry}
            />
          )}

          {tab === "achievements" && (
            <AchievementsTab achievements={achievements} />
          )}

          {tab === "settings" && (
            <SettingsTab
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
            />
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-40">
          <MiniPlayer
            songs={songs}
            onAddSong={handleAddSong}
            onDeleteSong={handleDeleteSong}
          />
          <NavBar tab={tab} setTab={setTab} />
        </div>
      </div>
    </div>
  );
}
