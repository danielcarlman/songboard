import { z } from "zod";
import { usersTable } from "./schema";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
export const envSchema = z.object({
  DB_URL: z.string(),
});

export const userSchema = createSelectSchema(usersTable);
export type User = z.infer<typeof userSchema>;

export const userInsertSchema = createInsertSchema(usersTable);
export type UserInsert = z.infer<typeof userInsertSchema>;

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
