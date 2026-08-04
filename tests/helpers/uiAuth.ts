import { Page } from "@playwright/test";
import { TEST_PASSWORD, uniqueUsername } from "./testData";

// Drives the real register + login forms so E2E tests exercise the same
// path a user would, rather than seeding a session via the API.
export async function registerAndLoginViaUI(page: Page) {
  const username = uniqueUsername();

  await page.goto("/register");
  await page.getByPlaceholder("username").fill(username);
  await page.getByPlaceholder("password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForURL("**/login");

  await page.getByPlaceholder("username").fill(username);
  await page.getByPlaceholder("password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/songs");

  return { username };
}
