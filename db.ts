import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/schema";
import env from "@/env";

const client = neon(env.DB_URL);
const db = drizzle({ client, schema });

export default db;
