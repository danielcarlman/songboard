import { registerInputSchema, registerOutputSchema } from "@/types";
import db from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const input = registerInputSchema.parse(body);
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.username, input.username),
  });
  if (existingUser) {
    return NextResponse.json(
      { message: "Username not available" },
      { status: 400 },
    );
  }
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const data = { username: input.username, password: hashedPassword };
  const [user] = await db.insert(usersTable).values(data).returning();
  const output = registerOutputSchema.parse(user);
  return NextResponse.json(output);
}
