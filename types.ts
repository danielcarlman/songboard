import { z } from "zod";
import { songsTable, usersTable } from "./schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
export const envSchema = z.object({
  DB_URL: z.string(),
});

export const userSchema = createSelectSchema(usersTable);
export type User = z.infer<typeof userSchema>;

export const userInsertSchema = createInsertSchema(usersTable);
export type UserInsert = z.infer<typeof userInsertSchema>;

export const songSchema = createSelectSchema(songsTable);
export type Song = z.infer<typeof songSchema>;

export const songInsertSchema = createInsertSchema(songsTable);
export type SongInsert = z.infer<typeof songInsertSchema>;

export const registerInputSchema = userInsertSchema.pick({
  username: true,
  password: true,
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerOutputSchema = userSchema.pick({
  id: true,
  username: true,
});
export type RegisterOutput = z.infer<typeof registerOutputSchema>;

export const loginInputSchema = registerInputSchema;
export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginOutputSchema = registerOutputSchema;
export type LoginOutput = z.infer<typeof loginOutputSchema>;

export const createSongInputSchema = songInsertSchema.pick({
  title: true,
  lyrics: true,
});
export type CreateSongInput = z.infer<typeof createSongInputSchema>;

export const createSongOutputSchema = songSchema;
export type CreateSongOutput = z.infer<typeof createSongOutputSchema>;
