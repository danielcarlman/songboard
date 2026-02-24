import db from "@/db";
import { songsTable } from "@/schema";
import {
  DeleteSongInput,
  deleteSongInputSchema,
  deleteSongOutputSchema,
} from "@/types";
import authenticate from "@/utils/authenticate";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<DeleteSongInput> },
) {
  const result = await authenticate();
  if (!result.authenticated) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  const params: unknown = await context.params;
  const input = deleteSongInputSchema.parse(params);
  const songCondition = eq(songsTable.id, input.id);
  const existingSong = await db.query.songsTable.findFirst({
    where: songCondition,
  });

  if (!existingSong) {
    return NextResponse.json(
      { message: "This song does not exist" },
      { status: 400 },
    );
  }

  if (existingSong.userId !== result.user.id) {
    return NextResponse.json(
      { message: "This song does not belong to this user" },
      { status: 400 },
    );
  }

  const [song] = await db.delete(songsTable).where(songCondition).returning();
  const output = deleteSongOutputSchema.parse(song);
  return NextResponse.json(output);
}
