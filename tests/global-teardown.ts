import { cleanupTestUsers } from "./helpers/db";

export default async function globalTeardown() {
  await cleanupTestUsers();
}
