import db from "@/db";
import { songsTable } from "@/schema";
import {
  updateSongInputSchema,
  updateSongOutputSchema,
  UpdateSongParams,
  updateSongParamsSchema,
} from "@/types";
import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import authenticate from "@/utils/authenticate";

export async function PUT(
  request: Request,
  context: { params: Promise<UpdateSongParams> },
) {
  const result = await authenticate();
  if (!result.authenticated) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  const params: unknown = await context.params;
  const inputParams = updateSongParamsSchema.parse(params);
  const songCondition = eq(songsTable.id, inputParams.id);
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
  const body: unknown = await request.json();
  const input = updateSongInputSchema.parse(body);

  const songTitleCondition = eq(songsTable.title, input.title);
  const songIdCondition = ne(songsTable.id, inputParams.id);
  const duplicateCondition = and(songTitleCondition, songIdCondition);
  const duplicateSong = await db.query.songsTable.findFirst({
    where: duplicateCondition,
  });

  if (duplicateSong != null) {
    return NextResponse.json(
      { message: "This song title already exists" },
      { status: 400 },
    );
  }

  await db.update(songsTable).set(input).where(songCondition);
  const output = updateSongOutputSchema.parse({ ok: true });
  return NextResponse.json(output);
}
