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
import authenticate from "@/utils/authenticate";

export async function POST(request: Request) {
  const result = await authenticate();
  if (!result.authenticated) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }
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
    userId: result.user.id,
    title: input.title,
    lyrics: input.lyrics,
  };
  const [song] = await db.insert(songsTable).values(data).returning();
  const output = createSongOutputSchema.parse(song);
  return NextResponse.json(output);
}
