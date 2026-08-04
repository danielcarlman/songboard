import { expect, test } from "@playwright/test";
import { registerAndLoginViaUI } from "../helpers/uiAuth";
import { uniqueTitle } from "../helpers/testData";

test.describe("create-song title validation", () => {
  test("rejects an empty title", async ({ page }) => {
    await registerAndLoginViaUI(page);

    await page.goto("/create-song");
    await page.getByPlaceholder("lyrics").fill("some lyrics");
    await page.getByRole("button", { name: "Create Song" }).click();

    await expect(page.getByText("Song created successfully")).not.toBeVisible();
  });

  test("rejects a title over 255 characters", async ({ page }) => {
    await registerAndLoginViaUI(page);

    await page.goto("/create-song");
    await page.getByPlaceholder("title").fill("a".repeat(256));
    await page.getByPlaceholder("lyrics").fill("some lyrics");
    await page.getByRole("button", { name: "Create Song" }).click();

    await expect(page.getByText("Song created successfully")).not.toBeVisible();
  });

  test("accepts a title exactly 255 characters", async ({ page }) => {
    await registerAndLoginViaUI(page);
    const title = "a".repeat(255);

    await page.goto("/create-song");
    await page.getByPlaceholder("title").fill(title);
    await page.getByPlaceholder("lyrics").fill("some lyrics");
    await page.getByRole("button", { name: "Create Song" }).click();

    await expect(page.getByText("Song created successfully")).toBeVisible();
  });
});

test.describe("update-song title validation", () => {
  async function createSongAndOpenUpdatePage(page: import("@playwright/test").Page) {
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
    await page.goto(href!);
    return title;
  }

  test("rejects an empty title and leaves the song unchanged", async ({ page }) => {
    await registerAndLoginViaUI(page);
    const title = await createSongAndOpenUpdatePage(page);

    await page.getByPlaceholder("title").fill("");
    await page.getByRole("button", { name: "Update Song" }).click();
    await expect(page.getByText("Song updated successfully")).not.toBeVisible();

    await page.reload();
    await expect(page.getByPlaceholder("title")).toHaveValue(title);
  });

  test("rejects a title over 255 characters and leaves the song unchanged", async ({
    page,
  }) => {
    await registerAndLoginViaUI(page);
    const title = await createSongAndOpenUpdatePage(page);

    await page.getByPlaceholder("title").fill("a".repeat(256));
    await page.getByRole("button", { name: "Update Song" }).click();
    await expect(page.getByText("Song updated successfully")).not.toBeVisible();

    await page.reload();
    await expect(page.getByPlaceholder("title")).toHaveValue(title);
  });

  test("accepts a title exactly 255 characters", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await createSongAndOpenUpdatePage(page);

    await page.getByPlaceholder("title").fill("b".repeat(255));
    await page.getByRole("button", { name: "Update Song" }).click();
    await expect(page.getByText("Song updated successfully")).toBeVisible();
  });
});
