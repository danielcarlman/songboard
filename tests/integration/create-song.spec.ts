import { expect, test } from "@playwright/test";
import { registerAndLogin } from "../helpers/auth";
import { uniqueTitle } from "../helpers/testData";

test("creates a song for the authenticated user", async ({ request }) => {
  await registerAndLogin(request);
  const title = uniqueTitle();

  const response = await request.post("/api/create-song", {
    data: { title, lyrics: "some lyrics" },
  });

  expect(response.ok()).toBe(true);
  const body = await response.json();
  expect(body).toMatchObject({ title, lyrics: "some lyrics" });
  expect(body.id).toBeTruthy();
});

test("rejects an unauthenticated request", async ({ request }) => {
  const response = await request.post("/api/create-song", {
    data: { title: uniqueTitle(), lyrics: "some lyrics" },
  });

  expect(response.status()).toBe(400);
});

test("rejects a duplicate title", async ({ request }) => {
  await registerAndLogin(request);
  const title = uniqueTitle();

  await request.post("/api/create-song", { data: { title, lyrics: "a" } });
  const response = await request.post("/api/create-song", {
    data: { title, lyrics: "b" },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("Song already exists");
});

test("rejects an empty title", async ({ request }) => {
  await registerAndLogin(request);

  const response = await request.post("/api/create-song", {
    data: { title: "", lyrics: "some lyrics" },
  });

  expect(response.ok()).toBe(false);
});

test("rejects a title over 255 characters", async ({ request }) => {
  await registerAndLogin(request);

  const response = await request.post("/api/create-song", {
    data: { title: "a".repeat(256), lyrics: "some lyrics" },
  });

  expect(response.ok()).toBe(false);
});

test("accepts a title exactly 255 characters", async ({ request }) => {
  await registerAndLogin(request);
  const title = `${uniqueTitle()}${"a".repeat(255)}`.slice(0, 255);

  const response = await request.post("/api/create-song", {
    data: { title, lyrics: "some lyrics" },
  });

  expect(response.ok()).toBe(true);
});
