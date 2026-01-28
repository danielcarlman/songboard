import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/db";
import { usersTable } from "@/schema";
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt");
  if (!cookie?.value) {
    return <div>Missing JWT</div>;
  }
  if (!process.env.JWT_SIGNATURE) {
    throw new Error("JWT signature is missing");
  }
  const payload = jwt.verify(cookie.value, process.env.JWT_SIGNATURE);
  console.log(payload);
  if (typeof payload === "string") {
    return <div>Invalid JWT</div>;
  }
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, payload.id),
  });
  if (!user) {
    return <div>User not found</div>;
  }
  return <h1>Dashboard. Hi {user.username}!</h1>;
}
