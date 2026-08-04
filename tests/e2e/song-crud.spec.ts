import { expect, test } from "@playwright/test";
import { registerAndLoginViaUI } from "../helpers/uiAuth";
import { uniqueTitle } from "../helpers/testData";

test("creating a song shows it in the songs list", async ({ page }) => {
  await registerAndLoginViaUI(page);
  const title = uniqueTitle();

  await page.goto("/create-song");
  await page.getByPlaceholder("title").fill(title);
  await page.getByPlaceholder("lyrics").fill("some lyrics");
  await page.getByRole("button", { name: "Create Song" }).click();
  await expect(page.getByText("Song created successfully")).toBeVisible();

  await page.goto("/songs");
  await expect(page.getByText(title)).toBeVisible();
});

test("updating a song persists the new title and lyrics", async ({ page }) => {
  await registerAndLoginViaUI(page);
  const title = uniqueTitle();
  const newTitle = uniqueTitle();

  await page.goto("/create-song");
  await page.getByPlaceholder("title").fill(title);
  await page.getByPlaceholder("lyrics").fill("original lyrics");
  await page.getByRole("button", { name: "Create Song" }).click();
  await expect(page.getByText("Song created successfully")).toBeVisible();

  await page.goto("/songs");
  const href = await page.getByRole("link", { name: "Update Song" }).getAttribute("href");
  await page.goto(href!);

  await expect(page.getByPlaceholder("title")).toHaveValue(title);
  await expect(page.getByPlaceholder("lyrics")).toHaveValue("original lyrics");

  await page.getByPlaceholder("title").fill(newTitle);
  await page.getByPlaceholder("lyrics").fill("updated lyrics");
  await page.getByRole("button", { name: "Update Song" }).click();
  await expect(page.getByText("Song updated successfully")).toBeVisible();

  await page.reload();
  await expect(page.getByPlaceholder("title")).toHaveValue(newTitle);
  await expect(page.getByPlaceholder("lyrics")).toHaveValue("updated lyrics");
});

test("deleting a song removes it from the list", async ({ page }) => {
  await registerAndLoginViaUI(page);
  const title = uniqueTitle();

  await page.goto("/create-song");
  await page.getByPlaceholder("title").fill(title);
  await page.getByPlaceholder("lyrics").fill("some lyrics");
  await page.getByRole("button", { name: "Create Song" }).click();
  await expect(page.getByText("Song created successfully")).toBeVisible();

  await page.goto("/songs");
  await expect(page.getByText(title)).toBeVisible();
  await page.getByRole("button", { name: "Delete Song" }).click();

  await expect(page.getByText(title)).not.toBeVisible();
});
