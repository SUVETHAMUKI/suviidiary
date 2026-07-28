"use client";

import {
  Home,
  ListChecks,
  Bell,
  Smile,
  PiggyBank,
  Award,
  Settings as SettingsIcon,
} from "lucide-react";

interface NavBarProps {
  tab: string;
  setTab: (t: string) => void;
}

export function NavBar({ tab, setTab }: NavBarProps) {
  const items = [
    { key: "home", icon: Home, label: "Home" },
    { key: "habits", icon: ListChecks, label: "Habits" },
    { key: "tasks", icon: Bell, label: "Tasks" },
    { key: "mood", icon: Smile, label: "Mood" },
    { key: "money", icon: PiggyBank, label: "Money" },
    { key: "achievements", icon: Award, label: "Badges" },
    { key: "settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <nav className="flex bg-white/95 backdrop-blur-md border-t border-[#f6d9e3] px-2 py-1.5 shadow-lg z-30 sticky bottom-0">
      {items.map(({ key, icon: Icon, label }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-0.5 rounded-xl transition-all cursor-pointer ${
              active
                ? "text-[#e0578a] bg-[#fde3ec]/80 font-bold transform -translate-y-0.5 shadow-sm"
                : "text-[#c98aa3] hover:text-[#a9607f] hover:bg-[#fff5f7]"
            }`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${active ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] sm:text-[11px] tracking-tight">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
