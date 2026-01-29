import {
  createSongInputSchema,
  createSongOutputSchema,
  loginOutputSchema,
  SongInsert,
} from "@/types";
import db from "@/db";
import { eq } from "drizzle-orm";
import { songsTable } from "@/schema";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt");
  if (!cookie?.value) {
    return NextResponse.json(
      { message: "User is not logged in" },
      { status: 400 },
    );
  }
  if (!process.env.JWT_SIGNATURE) {
    return NextResponse.json(
      { message: "JWT Signature missing" },
      { status: 400 },
    );
  }
  const payload = jwt.verify(cookie.value, process.env.JWT_SIGNATURE);
  if (typeof payload !== "object") {
    return NextResponse.json({ message: "Invalid JWT data" }, { status: 400 });
  }
  const user = loginOutputSchema.parse(payload);
  const body: unknown = await request.json();
  const input = createSongInputSchema.parse(body);
  const existingSong = await db.query.songsTable.findFirst({
    where: eq(songsTable.title, input.title),
  });

  if (existingSong) {
    return NextResponse.json(
      { message: "Song already exists" },
      { status: 400 },
    );
  }
  const data: SongInsert = {
    userId: user.id,
    title: input.title,
    lyrics: input.lyrics,
  };
  const [song] = await db.insert(songsTable).values(data).returning();
  const output = createSongOutputSchema.parse(song);
  return NextResponse.json(output);
}
