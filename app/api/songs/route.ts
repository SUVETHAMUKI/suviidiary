import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSoloUser } from "../user/route";

export async function GET() {
  try {
    const user = await getSoloUser();
    const songs = await prisma.song.findMany({
      where: { userId: user.id },
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSoloUser();
    const body = await request.json();
    const { title, artist, url } = body;

    if (!url?.trim()) {
      return NextResponse.json({ error: "Audio url is required" }, { status: 400 });
    }

    const song = await prisma.song.create({
      data: {
        title: title || "Custom Audio Track",
        artist: artist || "My Library",
        url: url.trim(),
        userId: user.id,
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error adding song:", error);
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.song.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
