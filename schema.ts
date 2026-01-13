import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  username: text().notNull(),
  password: text().notNull(),
});

export const songsTable = pgTable("songs", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: text().notNull(),
  lyrics: text(),
});

export const usersRelations = relations(usersTable, (props) => {
  return { songs: props.many(songsTable) };
});

export const songsRelations = relations(songsTable, (props) => {
  return { user: props.one(usersTable) };
});
