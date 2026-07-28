import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSoloUser } from "../user/route";

export async function GET() {
  try {
    const user = await getSoloUser();
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSoloUser();
    const body = await request.json();
    const { title, date, time, repeat } = body;

    if (!title?.trim() || !date || !time) {
      return NextResponse.json({ error: "title, date, and time are required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        date,
        time,
        repeat: repeat || "none",
        done: false,
        notified: false,
        userId: user.id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, done, notified } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (done !== undefined) updateData.done = done;
    if (notified !== undefined) updateData.notified = notified;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
