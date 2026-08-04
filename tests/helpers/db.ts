import "dotenv/config";
import { eq, like } from "drizzle-orm";
import db from "@/db";
import { songsTable, usersTable } from "@/schema";
import { TEST_PREFIX } from "./testData";

// Deletes every user created by the test suite. Cascades to their songs
// via the songs.userId onDelete: "cascade" foreign key in schema.ts.
export async function cleanupTestUsers() {
  await db.delete(usersTable).where(like(usersTable.username, `${TEST_PREFIX}_%`));
}

export async function findSongById(id: string) {
  return db.query.songsTable.findFirst({ where: eq(songsTable.id, id) });
}
