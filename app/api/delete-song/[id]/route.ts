import {
  DeleteSongInput,
  deleteSongInputSchema,
  deleteSongOutputSchema,
  loginOutputSchema,
} from "@/types";
import db from "@/db";
import { eq } from "drizzle-orm";
import { songsTable, usersTable } from "@/schema";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function DELETE(
  request: Request,
  context: { params: Promise<DeleteSongInput> },
) {
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
  const login = loginOutputSchema.parse(payload);
  const userCondition = eq(usersTable.id, login.id);
  const user = await db.query.usersTable.findFirst({
    where: userCondition,
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
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

  if (existingSong.userId !== user.id) {
    return NextResponse.json(
      { message: "This song does not belong to this user" },
      { status: 400 },
    );
  }

  const [song] = await db.delete(songsTable).where(songCondition).returning();
  const output = deleteSongOutputSchema.parse(song);
  return NextResponse.json(output);
}
