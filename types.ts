import { z } from "zod";
export const envSchema = z.object({
  DB_URL: z.string(),
});
