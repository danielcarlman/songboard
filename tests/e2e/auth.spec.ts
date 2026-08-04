import { expect, test } from "@playwright/test";
import { registerAndLoginViaUI } from "../helpers/uiAuth";
import { TEST_PASSWORD, uniqueUsername } from "../helpers/testData";

test("register then login lands on the songs page", async ({ page }) => {
  const { username } = await registerAndLoginViaUI(page);

  await expect(page).toHaveURL(/\/songs$/);
  await expect(
    page.getByRole("button", { name: `Logout (${username})` }),
  ).toBeVisible();
});

test("login with the wrong password shows an error and stays on the page", async ({
  page,
}) => {
  const { username } = await registerAndLoginViaUI(page);
  await page.getByRole("button", { name: `Logout (${username})` }).click();
  await page.waitForURL("**/login");

  await page.getByPlaceholder("username").fill(username);
  await page.getByPlaceholder("password").fill("WrongPassword123!");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Password is incorrect")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("login with an unregistered username shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("username").fill(uniqueUsername());
  await page.getByPlaceholder("password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Username is not registered")).toBeVisible();
});

test("logout ends the session", async ({ page }) => {
  const { username } = await registerAndLoginViaUI(page);
  await page.getByRole("button", { name: `Logout (${username})` }).click();

  await page.waitForURL("**/login");
  await page.goto("/songs");
  await expect(page).toHaveURL(/\/login$/);
});
