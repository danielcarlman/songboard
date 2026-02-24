import db from "@/db";
import { songsTable } from "@/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import UpdateSongForm from "@/components/UpdateSongForm";
import authenticate from "@/utils/authenticate";

interface UpdatePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdatePage({ params }: UpdatePageProps) {
  const { id } = await params;
  const songCondition = eq(songsTable.id, id);

  const result = await authenticate();
  if (!result.authenticated) {
    redirect("/login");
  }

  const existingSong = await db.query.songsTable.findFirst({
    where: songCondition,
  });

  if (!existingSong) {
    redirect("/songs");
  }

  if (existingSong.userId !== result.user.id) {
    redirect("/songs");
  }
  return <UpdateSongForm song={existingSong} />;
}
