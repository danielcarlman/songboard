import db from "@/db";
import { usersTable } from "@/schema";
import { loginInputSchema, loginOutputSchema } from "@/types";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const input = loginInputSchema.parse(body);
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.username, input.username),
  });
  if (!existingUser) {
    return NextResponse.json(
      { message: "Username is not registered" },
      { status: 400 },
    );
  }
  const match = await bcrypt.compare(input.password, existingUser.password);
  if (!match) {
    return NextResponse.json(
      { message: "Password is incorrect" },
      { status: 400 },
    );
  }
  const output = loginOutputSchema.parse(existingUser);
  if (!process.env.JWT_SIGNATURE) {
    throw new Error("JWT signature is missing");
  }
  const token = jwt.sign(output, process.env.JWT_SIGNATURE, {
    expiresIn: "1h",
  });
  const cookieStore = await cookies();
  cookieStore.set("jwt", token);
  return NextResponse.json(output);
}
