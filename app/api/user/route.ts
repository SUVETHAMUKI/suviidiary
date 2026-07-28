import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import defaultHabits from "@/data/default-habits.json";
import defaultSongs from "@/data/default-songs.json";

// For a solo user app without forcing complex auth setup immediately,
// we get or create the default solo user "suvii-solo-user".
export async function getSoloUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "suvii@diary.me",
        name: "Suvii",
        savingsGoal: 5000,
      },
    });

    // Pre-seed the 11 habits from user diary photo
    for (const h of defaultHabits) {
      await prisma.habit.create({
        data: {
          name: h.name,
          category: h.category,
          userId: user.id,
        },
      });
    }

    // Pre-seed default soothing songs
    for (const s of defaultSongs) {
      await prisma.song.create({
        data: {
          title: s.title,
          artist: s.artist,
          url: s.url,
          userId: user.id,
        },
      });
    }
  }

  // Ensure user has habits if they were deleted or newly created
  const habitsCount = await prisma.habit.count({ where: { userId: user.id } });
  if (habitsCount === 0) {
    for (const h of defaultHabits) {
      await prisma.habit.create({
        data: {
          name: h.name,
          category: h.category,
          userId: user.id,
        },
      });
    }
  }

  // Ensure user has default songs if empty
  const songsCount = await prisma.song.count({ where: { userId: user.id } });
  if (songsCount === 0) {
    for (const s of defaultSongs) {
      await prisma.song.create({
        data: {
          title: s.title,
          artist: s.artist,
          url: s.url,
          userId: user.id,
        },
      });
    }
  }

  return user;
}

export async function GET() {
  try {
    const user = await getSoloUser();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching solo user:", error);
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSoloUser();
    const body = await request.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        savingsGoal: body.savingsGoal !== undefined ? Number(body.savingsGoal) : undefined,
        bgImage: body.bgImage !== undefined ? body.bgImage : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 });
  }
}
