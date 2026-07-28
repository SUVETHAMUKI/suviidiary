import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding Suvii Diary database...");

  const songsPath = path.join(process.cwd(), "data", "default-songs.json");
  const defaultSongs = JSON.parse(fs.readFileSync(songsPath, "utf-8"));

  // Upsert default solo user
  const user = await prisma.user.upsert({
    where: { email: "suvii@diary.me" },
    update: {},
    create: {
      email: "suvii@diary.me",
      name: "Suvii 🌸",
      savingsGoal: 5000,
    },
  });

  // Clean up existing data for idempotent seeding
  await prisma.habitLog.deleteMany({});
  await prisma.habit.deleteMany({ where: { userId: user.id } });
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.moodLog.deleteMany({ where: { userId: user.id } });
  await prisma.moneyEntry.deleteMany({ where: { userId: user.id } });

  const todayStr = new Date().toISOString().slice(0, 10);
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Seed default habits
  const habitsData = [
    { name: "Morning Tamil Slogans & Prayer 🪔", category: "Morning Glow ✨" },
    { name: "Drink 2L Water 💧", category: "Health & Diet 🥗" },
    { name: "15 Mins Yoga / Stretching 🧘‍♀️", category: "Fitness & Yoga 🧘‍♀️" },
    { name: "Read 10 Pages of Book 📚", category: "Study / Work 📚" },
    { name: "Evening Skincare Routine 🌸", category: "Skin Care 🌸" },
  ];

  for (const h of habitsData) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: h.name,
        category: h.category,
      },
    });

    // Mark completed today and yesterday for initial streak!
    await prisma.habitLog.create({
      data: {
        habitId: habit.id,
        date: todayStr,
        done: true,
      },
    });
    await prisma.habitLog.create({
      data: {
        habitId: habit.id,
        date: yesterdayStr,
        done: true,
      },
    });
  }

  // Seed sample tasks & reminders
  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        title: "Morning Tamil Slogan Practice ✨",
        date: todayStr,
        time: "07:30",
        repeat: "daily",
        done: true,
      },
      {
        userId: user.id,
        title: "Review Monthly Money Budget 💰",
        date: todayStr,
        time: "17:00",
        repeat: "weekly",
        done: false,
      },
      {
        userId: user.id,
        title: "Evening Walk & Tamil Songs 🎶",
        date: todayStr,
        time: "18:30",
        repeat: "daily",
        done: false,
      },
    ],
  });

  // Seed sample mood logs
  await prisma.moodLog.createMany({
    data: [
      {
        userId: user.id,
        date: yesterdayStr,
        mood: "grateful",
        note: "Listened to beautiful Tamil melodies during sunset 🥰",
      },
      {
        userId: user.id,
        date: todayStr,
        mood: "happy",
        note: "Feeling glowing and motivated today! ✨",
      },
    ],
  });

  // Seed sample money entries
  await prisma.moneyEntry.createMany({
    data: [
      {
        userId: user.id,
        type: "income",
        category: "Allowance / Pocket Money 🌸",
        amount: 3500,
        date: todayStr,
        note: "Monthly allowance",
      },
      {
        userId: user.id,
        type: "expense",
        category: "Self Care & Beauty 💄",
        amount: 450,
        date: todayStr,
        note: "Rosewater & skincare",
      },
      {
        userId: user.id,
        type: "expense",
        category: "Food & Snacks 🍰",
        amount: 250,
        date: todayStr,
        note: "Evening tea & snacks",
      },
    ],
  });

  // Seed default Tamil songs
  for (const song of defaultSongs) {
    await prisma.song.create({
      data: {
        userId: user.id,
        title: song.title,
        artist: song.artist,
        url: song.url,
      },
    });
  }

  console.log("✅ Seeding complete! Suvii Diary is glowing and ready to use!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
