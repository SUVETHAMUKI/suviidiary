import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSoloUser } from "../user/route";

export async function GET() {
  try {
    const user = await getSoloUser();
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        logs: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Format logs as a simple checks map { [date]: boolean } for UI convenience
    const formatted = habits.map((h) => {
      const checks: Record<string, boolean> = {};
      h.logs.forEach((l) => {
        if (l.done) checks[l.date] = true;
      });
      return {
        id: h.id,
        name: h.name,
        category: h.category || "General",
        checks,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSoloUser();
    const body = await request.json();
    const { name, category } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Habit name is required" }, { status: 400 });
    }

    const habit = await prisma.habit.create({
      data: {
        name: name.trim(),
        category: category || "General",
        userId: user.id,
      },
      include: { logs: true },
    });

    return NextResponse.json({
      id: habit.id,
      name: habit.name,
      category: habit.category || "General",
      checks: {},
    });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { habitId, date } = body;

    if (!habitId || !date) {
      return NextResponse.json({ error: "habitId and date are required" }, { status: 400 });
    }

    const existing = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (existing) {
      if (existing.done) {
        await prisma.habitLog.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ status: "unchecked", date });
      } else {
        await prisma.habitLog.update({
          where: { id: existing.id },
          data: { done: true },
        });
        return NextResponse.json({ status: "checked", date });
      }
    } else {
      await prisma.habitLog.create({
        data: {
          habitId,
          date,
          done: true,
        },
      });
      return NextResponse.json({ status: "checked", date });
    }
  } catch (error) {
    console.error("Error toggling habit:", error);
    return NextResponse.json({ error: "Failed to toggle habit" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json({ error: "Failed to delete habit" }, { status: 500 });
  }
}
