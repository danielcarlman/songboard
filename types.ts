import { z } from "zod";
import { songsTable, usersTable } from "./schema";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
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

export const songUpdateSchema = createUpdateSchema(songsTable);
export type SongUpdate = z.infer<typeof songUpdateSchema>;

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

export const deleteSongInputSchema = songSchema.pick({ id: true });
export type DeleteSongInput = z.infer<typeof deleteSongInputSchema>;

export const deleteSongOutputSchema = deleteSongInputSchema;
export type DeleteSongOutput = z.infer<typeof deleteSongOutputSchema>;

export const updateSongParamsSchema = songUpdateSchema
  .pick({
    id: true,
  })
  .required();
export type UpdateSongParams = z.infer<typeof updateSongParamsSchema>;

export const updateSongInputSchema = songUpdateSchema
  .pick({
    title: true,
  })
  .extend({ lyrics: z.string() })
  .required();

export type UpdateSongInput = z.infer<typeof updateSongInputSchema>;

export const updateSongOutputSchema = z.object({
  ok: z.boolean(),
});
export type UpdateSongOutputSchema = z.infer<typeof updateSongOutputSchema>;
