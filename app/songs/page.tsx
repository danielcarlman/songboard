import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/db";
import { usersTable, songsTable } from "@/schema";
import { eq } from "drizzle-orm";
import DeleteButton from "@/components/DeleteButton";
import Link from "next/link";

export default async function Songs() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt");
  if (!cookie?.value) {
    return <div>Missing JWT</div>;
  }
  if (!process.env.JWT_SIGNATURE) {
    throw new Error("JWT signature is missing");
  }
  const payload = jwt.verify(cookie.value, process.env.JWT_SIGNATURE);
  if (typeof payload === "string") {
    return <div>Invalid JWT</div>;
  }
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, payload.id),
  });
  if (!user) {
    return <div>User not found</div>;
  }
  const songs = await db.query.songsTable.findMany({
    where: eq(songsTable.userId, user.id),
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
