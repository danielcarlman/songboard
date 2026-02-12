import db from "@/db";
import { songsTable, usersTable } from "@/schema";
import { loginOutputSchema } from "@/types";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import UpdateSongForm from "@/components/UpdateSongForm";

interface UpdatePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { id } = await params;
  const songCondition = eq(songsTable.id, id);
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt");
  if (!cookie?.value) {
    redirect("/dashboard");
  }
  if (!process.env.JWT_SIGNATURE) {
    throw new Error("JWT is missing");
  }
  const payload = jwt.verify(cookie.value, process.env.JWT_SIGNATURE);
  if (typeof payload !== "object") {
    redirect("/login");
  }
  const login = loginOutputSchema.parse(payload);
  const userCondition = eq(usersTable.id, login.id);
  const user = await db.query.usersTable.findFirst({
    where: userCondition,
  });
  if (!user) {
    redirect("/login");
  }

  const existingSong = await db.query.songsTable.findFirst({
    where: songCondition,
  });

  if (!existingSong) {
    redirect("/songs");
  }

  if (existingSong.userId !== user.id) {
    redirect("/dashboard");
  }
  return <UpdateSongForm song={existingSong} />;
}
