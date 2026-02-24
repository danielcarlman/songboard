import db from "@/db";
import { songsTable } from "@/schema";
import { eq } from "drizzle-orm";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";
import authenticate from "@/utils/authenticate";
import { redirect } from "next/navigation";

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
  return (
    <div>
      <h1>Songs:</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <h2>{song.title}</h2>
            <p>{song.lyrics}</p>
            <div className="flex gap-2 items-center">
              <Link
                className="border px-2 py-1 bg-blue-950 text-white cursor-pointer"
                href={`/update-song/${song.id}`}
              >
                Update Song
              </Link>
              <DeleteButton songId={song.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
