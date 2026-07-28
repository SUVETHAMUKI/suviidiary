"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  PieChart as PieIcon,
  BarChart2,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MoneyEntryItem } from "../types";

interface MoneyTabProps {
  entries: MoneyEntryItem[];
  savingsGoal: number;
  onAddEntry: (
    type: "income" | "expense",
    category: string,
    amount: number,
    date: string,
    note?: string
  ) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
}

const CATEGORIES_INCOME = [
  "Allowance / Pocket Money 🌸",
  "Salary / Work 💼",
  "Gift / Bonus 🎁",
  "Savings Interest 💰",
  "Other Income ✨",
];

const CATEGORIES_EXPENSE = [
  "Shopping & Fashion 👗",
  "Self Care & Beauty 💄",
  "Food & Snacks 🍰",
  "Books & Study 📚",
  "Music & Entertainment 🎶",
  "Travel & Rides 🚗",
  "Bills & Recharges 📱",
];

const COLORS = ["#e0578a", "#8e62c6", "#3aa77c", "#e69b24", "#4d73b8", "#d6336c", "#a9607f"];

export function MoneyTab({
  entries,
  savingsGoal,
  onAddEntry,
  onDeleteEntry,
}: MoneyTabProps) {
  const validEntries = Array.isArray(entries) ? entries : [];
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState(CATEGORIES_EXPENSE[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const totalIncome = validEntries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalExpense = validEntries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const remaining = totalIncome - totalExpense;
  const savingsPct = Math.min(
    100,
    Math.round((Math.max(0, remaining) / (savingsGoal || 1)) * 100)
  );

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType);
    if (newType === "income") {
      setCategory(CATEGORIES_INCOME[0]);
    } else {
      setCategory(CATEGORIES_EXPENSE[0]);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    await onAddEntry(type, category, val, date, note.trim());
    setAmount("");
    setNote("");
  };

  const fmtMoney = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

  // Chart Data: Bar Chart Income vs Expense
  const barData = [
    { name: "Income", amount: totalIncome, fill: "#3aa77c" },
    { name: "Spent", amount: totalExpense, fill: "#d6336c" },
    { name: "Remaining", amount: Math.max(0, remaining), fill: "#8e62c6" },
  ];

  // Pie Chart: Expense Breakdown
  const catMap: Record<string, number> = {};
  validEntries
    .filter((e) => e.type === "expense")
    .forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
    });

  const pieData = Object.entries(catMap).map(([name, val]) => ({
    name: name.split(" ")[0],
    value: val,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Title & Description */}
      <div>
        <h2 className="font-fraunces italic text-2xl font-bold text-[#7a2348]">
          Money & Savings Tracker 🐷
        </h2>
        <p className="text-xs text-[#a9607f]">
          Track how much you spend, earn, and save toward your customized savings goal!
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 p-5 rounded-2xl border border-[#f6d9e3] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#a9607f]">Total Earned</div>
            <div className="text-2xl font-bold text-[#3aa77c] mt-1">
              {fmtMoney(totalIncome)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#e8faf2] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#3aa77c]" />
          </div>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl border border-[#f6d9e3] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#a9607f]">Total Spent</div>
            <div className="text-2xl font-bold text-[#d6336c] mt-1">
              {fmtMoney(totalExpense)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fde3ec] flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-[#d6336c]" />
          </div>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl border border-[#f6d9e3] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#a9607f]">
              Remaining Balance
            </div>
            <div className="text-2xl font-bold text-[#8e62c6] mt-1">
              {fmtMoney(remaining)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ede4fa] flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#8e62c6]" />
          </div>
        </div>
      </div>

      {/* Savings Goal Progress */}
      <div className="bg-gradient-to-r from-[#fff0f5] via-[#fde3ec] to-[#ede4fa] p-5 rounded-2xl border border-[#f0c4d4] shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e0578a]" />
            <span className="font-fraunces italic text-lg font-bold text-[#7a2348]">
              My Savings Goal Progress
            </span>
          </div>
          <span className="text-xs font-bold text-[#d6336c]">
            {fmtMoney(Math.max(0, remaining))} / {fmtMoney(savingsGoal)} ({savingsPct}%)
          </span>
        </div>
        <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-[#f6d9e3]">
          <div
            className="bg-gradient-to-r from-[#e0578a] to-[#8e62c6] h-3 rounded-full transition-all duration-700"
            style={{ width: `${savingsPct}%` }}
          />
        </div>
        <p className="text-xs text-[#a9607f] mt-2 italic">
          {savingsPct >= 100
            ? "🎉 Congratulations! You hit your savings goal! Treat yourself to something special!"
            : `Keep going! Just ${fmtMoney(Math.max(0, savingsGoal - remaining))} more to reach your dream target 🌸`}
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white/90 p-5 rounded-2xl border border-[#f6d9e3] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-[#e0578a]" />
            <h3 className="font-fraunces italic text-base font-bold text-[#7a2348]">
              Income vs Spent vs Remaining
            </h3>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#a9607f" fontSize={12} />
                <YAxis stroke="#a9607f" fontSize={12} />
                <Tooltip
                  formatter={(value: unknown) => [fmtMoney(Number(value || 0)), "Amount"]}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/90 p-5 rounded-2xl border border-[#f6d9e3] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-[#8e62c6]" />
            <h3 className="font-fraunces italic text-base font-bold text-[#7a2348]">
              Expense Breakdown by Category
            </h3>
          </div>
          {pieData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-[#a9607f]">
              No expense transactions logged yet 🌸
            </div>
          ) : (
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => [fmtMoney(Number(value || 0)), "Spent"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white/90 p-5 rounded-2xl border border-[#f6d9e3] shadow-sm space-y-3"
      >
        <div className="text-xs font-bold text-[#7a2348] uppercase tracking-wider">
          + Add Money Entry
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === "expense"
                ? "bg-[#d6336c] text-white shadow-xs"
                : "bg-[#fff5f7] text-[#7a2348]"
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === "income"
                ? "bg-[#3aa77c] text-white shadow-xs"
                : "bg-[#e8faf2] text-[#2b7d5d]"
            }`}
          >
            Income (+)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none bg-white text-[#7a2348]"
            >
              {(type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none text-[#7a2348]"
              step="any"
              min="1"
            />
          </div>

          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none text-[#7a2348]"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Note / place (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f0c4d4] text-sm outline-none text-[#7a2348]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-gradient-to-r from-[#e0578a] to-[#d6336c] hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Save Entry
          </button>
        </div>
      </form>

      {/* Recent Transactions List */}
      <div className="space-y-2">
        <h3 className="font-fraunces italic text-lg font-bold text-[#7a2348]">
          Recent Transactions
        </h3>
        {validEntries.length === 0 ? (
          <div className="bg-white/70 p-8 rounded-2xl border border-[#f6d9e3] text-center text-sm text-[#a9607f]">
            No money transactions recorded yet. Add an income or expense above! 🌸
          </div>
        ) : (
          validEntries.map((e) => (
            <div
              key={e.id}
              className="bg-white/90 p-4 rounded-2xl border border-[#f6d9e3] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    e.type === "income" ? "bg-[#3aa77c]" : "bg-[#d6336c]"
                  }`}
                />
                <div>
                  <div className="text-sm font-bold text-[#7a2348]">
                    {e.category}
                  </div>
                  <div className="text-xs text-[#a9607f]">
                    {e.date} {e.note ? `· ${e.note}` : ""}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-bold ${
                    e.type === "income" ? "text-[#3aa77c]" : "text-[#d6336c]"
                  }`}
                >
                  {e.type === "income" ? "+" : "-"} {fmtMoney(e.amount)}
                </span>
                <button
                  onClick={() => onDeleteEntry(e.id)}
                  className="p-1.5 text-[#c98aa3] hover:text-[#d6336c] rounded-full transition-colors cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
