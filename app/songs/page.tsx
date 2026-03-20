import db from "@/db";
import { songsTable } from "@/schema";
import { eq } from "drizzle-orm";
import authenticate from "@/utils/authenticate";
import { redirect } from "next/navigation";
import SongsList from "@/components/SongsList";

export default async function Songs() {
  const result = await authenticate();
  if (!result.authenticated) {
    redirect("/login");
  }
  const songs = await db.query.songsTable.findMany({
    where: eq(songsTable.userId, result.user.id),
  });
  if (!songs.length) {
    return <div>No songs available</div>;
  }
  return <SongsList songs={songs} />;
}
