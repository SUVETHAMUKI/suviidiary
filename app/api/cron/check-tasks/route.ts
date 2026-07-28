import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTaskDueEmail } from "@/lib/email";

export async function GET() {
  return handleCheckTasks();
}

export async function POST() {
  return handleCheckTasks();
}

async function handleCheckTasks() {
  try {
    const now = new Date();
    // Use local YYYY-MM-DD and HH:MM format
    const todayStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);

    // Find tasks that are due today up to current time and not yet notified
    const dueTasks = await prisma.task.findMany({
      where: {
        date: todayStr,
        time: {
          lte: timeStr,
        },
        done: false,
        notified: false,
      },
      include: {
        user: true,
      },
    });

    const results = [];

    for (const task of dueTasks) {
      const recipient = task.user.email || "suvii@diary.me";
      const emailRes = await sendTaskDueEmail(recipient, task.title, task.time);

      await prisma.task.update({
        where: { id: task.id },
        data: { notified: true },
      });

      results.push({
        taskId: task.id,
        title: task.title,
        recipient,
        email: emailRes,
      });
    }

    return NextResponse.json({
      success: true,
      checkedAt: new Date().toISOString(),
      dueCount: dueTasks.length,
      results,
    });
  } catch (error) {
    console.error("Error in check-tasks cron:", error);
    return NextResponse.json({ error: "Cron execution failed" }, { status: 500 });
  }
}
