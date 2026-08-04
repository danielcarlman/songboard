import { cleanupTestUsers } from "./helpers/db";

// Sweeps leftover test users from a previous crashed/interrupted run before
// the suite starts, since tests run against the real dev database.
export default async function globalSetup() {
  await cleanupTestUsers();
}
