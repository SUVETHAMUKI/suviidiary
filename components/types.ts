export interface HabitItem {
  id: string;
  name: string;
  category: string;
  checks: Record<string, boolean>;
}

export interface TaskItem {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: "none" | "daily" | "weekly";
  done: boolean;
  notified?: boolean;
}

export interface MoodLogItem {
  id?: string;
  date: string;
  mood: string;
  note?: string | null;
}

export interface MoneyEntryItem {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  note?: string | null;
}

export interface AchievementItem {
  id: string;
  label: string;
  need: boolean;
  hint: string;
  icon?: string;
}

export interface UserSettings {
  name?: string;
  savingsGoal: number;
  bgImage?: string | null;
  notifEnabled?: boolean;
}
