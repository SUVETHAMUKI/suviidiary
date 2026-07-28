import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSoloUser } from "../user/route";

export async function GET() {
  try {
    const user = await getSoloUser();
    const moodLogs = await prisma.moodLog.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    const moodsMap: Record<string, string> = {};
    moodLogs.forEach((l) => {
      moodsMap[l.date] = l.mood;
    });

    return NextResponse.json({
      map: moodsMap,
      history: moodLogs,
    });
  } catch (error) {
    console.error("Error fetching mood logs:", error);
    return NextResponse.json({ error: "Failed to fetch mood logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSoloUser();
    const body = await request.json();
    const { date, mood, note } = body;

    if (!date || !mood) {
      return NextResponse.json({ error: "date and mood are required" }, { status: 400 });
    }

    const log = await prisma.moodLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      update: {
        mood,
        note: note || null,
      },
      create: {
        userId: user.id,
        date,
        mood,
        note: note || null,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error logging mood:", error);
    return NextResponse.json({ error: "Failed to log mood" }, { status: 500 });
  }
}
