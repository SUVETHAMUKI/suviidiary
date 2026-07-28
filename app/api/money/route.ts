import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSoloUser } from "../user/route";

export async function GET() {
  try {
    const user = await getSoloUser();
    const entries = await prisma.moneyEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      entries,
      savingsGoal: user.savingsGoal || 5000,
    });
  } catch (error) {
    console.error("Error fetching money entries:", error);
    return NextResponse.json({ error: "Failed to fetch money entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSoloUser();
    const body = await request.json();
    const { type, category, amount, date, note } = body;

    if (!type || !amount || !date) {
      return NextResponse.json({ error: "type, amount, and date are required" }, { status: 400 });
    }

    const entry = await prisma.moneyEntry.create({
      data: {
        type,
        category: category || (type === "income" ? "Income" : "Expense"),
        amount: Number(amount),
        date,
        note: note || null,
        userId: user.id,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error creating money entry:", error);
    return NextResponse.json({ error: "Failed to create money entry" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.moneyEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting money entry:", error);
    return NextResponse.json({ error: "Failed to delete money entry" }, { status: 500 });
  }
}
