import { expect, test } from "@playwright/test";
import { registerAndLoginViaUI } from "../helpers/uiAuth";
import { uniqueTitle } from "../helpers/testData";

test.describe("unauthenticated access", () => {
  for (const path of ["/songs", "/create-song", "/update-song/nonexistent-id"]) {
    test(`redirects ${path} to /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});

test("visiting a nonexistent song id redirects to /songs", async ({ page }) => {
  await registerAndLoginViaUI(page);

  await page.goto("/update-song/00000000-0000-0000-0000-000000000000");
  await expect(page).toHaveURL(/\/songs$/);
});

test("visiting another user's song id redirects to /songs", async ({
  page,
  browser,
}) => {
  await registerAndLoginViaUI(page);
  const title = uniqueTitle();
  await page.goto("/create-song");
  await page.getByPlaceholder("title").fill(title);
  await page.getByPlaceholder("lyrics").fill("some lyrics");
  await page.getByRole("button", { name: "Create Song" }).click();
  await expect(page.getByText("Song created successfully")).toBeVisible();

  await page.goto("/songs");
  const href = await page
    .getByRole("link", { name: "Update Song" })
    .getAttribute("href");

  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  await registerAndLoginViaUI(otherPage);
  await otherPage.goto(href!);
  await expect(otherPage).toHaveURL(/\/songs$/);
  await otherContext.close();
});
