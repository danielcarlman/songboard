import { z } from "zod";
import { songsTable, usersTable } from "./schema";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

// ENVIRONMENT TYPES
export const envSchema = z.object({
  DB_URL: z.string(),
});

// DATABASE TYPES

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

// API TYPES

export const userDataSchema = userSchema.pick({
  id: true,
  username: true,
});
export type UserData = z.infer<typeof userDataSchema>;

export const errorOutputSchema = z.object({ message: z.string() });
export type ErrorOutput = z.infer<typeof errorOutputSchema>;

export const registerInputSchema = userInsertSchema.pick({
  username: true,
  password: true,
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const registerOutputSchema = z.union([
  userDataSchema,
  errorOutputSchema,
]);

export type RegisterOutput = z.infer<typeof registerOutputSchema>;

export const loginInputSchema = registerInputSchema;
export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginOutputSchema = z.union([userDataSchema, errorOutputSchema]);

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

// CONTEXT TYPES

export interface AuthContextValue {
  authenticated: boolean;
  login: (username: string, password: string) => Promise<string | undefined>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<string | undefined>;
  user?: UserData;
}
