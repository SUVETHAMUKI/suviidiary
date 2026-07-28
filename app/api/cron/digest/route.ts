import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDigestEmail } from "@/lib/email";
import quotes from "@/data/tamil-quotes.json";

export async function GET(request: Request) {
  return handleDigest(request);
}

export async function POST(request: Request) {
  return handleDigest(request);
}

async function handleDigest(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") === "weekly" ? "weekly" : "daily") as "daily" | "weekly";

    const users = await prisma.user.findMany();

    const results = [];
    const todayStr = new Date().toISOString().slice(0, 10);

    for (const user of users) {
      // Calculate habits done today vs total habits
      const habitsTotal = await prisma.habit.count({ where: { userId: user.id } });
      const habitsDone = await prisma.habitLog.count({
        where: {
          habit: { userId: user.id },
          date: todayStr,
          done: true,
        },
      });

      // Tasks done vs total
      const tasksTotal = await prisma.task.count({
        where: {
          userId: user.id,
          date: todayStr,
        },
      });
      const tasksDone = await prisma.task.count({
        where: {
          userId: user.id,
          date: todayStr,
          done: true,
        },
      });

      // Calculate streak
      const habits = await prisma.habit.findMany({
        where: { userId: user.id },
        include: { logs: true },
      });

      let bestStreak = 0;
      for (const h of habits) {
        const doneDates = new Set(h.logs.filter((l) => l.done).map((l) => l.date));
        let streak = 0;
        // Check back up to 30 days
        const d = new Date();
        for (let i = 0; i < 30; i++) {
          const dt = new Date(d);
          dt.setDate(dt.getDate() - i);
          const dateStr = dt.toISOString().slice(0, 10);
          if (doneDates.has(dateStr)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        if (streak > bestStreak) bestStreak = streak;
      }

      // Calculate savings balance
      const entries = await prisma.moneyEntry.findMany({ where: { userId: user.id } });
      const totalIncome = entries.filter((e) => e.type === "income").reduce((sum, e) => sum + e.amount, 0);
      const totalExpense = entries.filter((e) => e.type === "expense").reduce((sum, e) => sum + e.amount, 0);
      const savingsBalance = totalIncome - totalExpense;

      // Pick random motivational quote
      const quote = quotes[Math.floor(Math.random() * quotes.length)];

      const emailRes = await sendDigestEmail({
        userEmail: user.email,
        userName: user.name || "Suvii",
        period,
        habitsDone,
        habitsTotal,
        tasksDone,
        tasksTotal,
        currentStreak: bestStreak,
        savingsBalance,
        quote,
      });

      results.push({
        user: user.email,
        period,
        email: emailRes,
      });
    }

    return NextResponse.json({
      success: true,
      sentAt: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error("Error in digest cron:", error);
    return NextResponse.json({ error: "Digest cron execution failed" }, { status: 500 });
  }
}
