import { randomUUID } from "node:crypto";

// Every user/song created by the suite is prefixed with this so global
// setup/teardown can find and remove it from the shared dev database
// without touching real data.
export const TEST_PREFIX = "pwtest";

export const TEST_PASSWORD = "TestPass123!";

export function uniqueUsername() {
  return `${TEST_PREFIX}_${randomUUID().slice(0, 8)}`;
}

export function uniqueTitle() {
  return `${TEST_PREFIX} song ${randomUUID().slice(0, 8)}`;
}
