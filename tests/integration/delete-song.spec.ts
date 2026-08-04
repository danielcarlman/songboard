import { expect, request as playwrightRequest, test } from "@playwright/test";
import { registerAndLogin } from "../helpers/auth";
import { findSongById } from "../helpers/db";
import { createSong } from "../helpers/song";

test("deletes a song owned by the authenticated user", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);

  const response = await request.delete(`/api/delete-song/${song.id}`);

  expect(response.ok()).toBe(true);
  expect(await findSongById(song.id)).toBeUndefined();
});

test("rejects an unauthenticated request", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);
  await request.get("/api/logout");

  const response = await request.delete(`/api/delete-song/${song.id}`);

  expect(response.status()).toBe(400);
  expect(await findSongById(song.id)).toBeDefined();
});

test("rejects deleting a song that does not exist", async ({ request }) => {
  await registerAndLogin(request);

  const response = await request.delete(
    "/api/delete-song/00000000-0000-0000-0000-000000000000",
  );

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("This song does not exist");
});

test("rejects deleting a song owned by another user", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);

  const otherContext = await playwrightRequest.newContext({
    baseURL: "http://localhost:3000",
  });
  await registerAndLogin(otherContext);

  const response = await otherContext.delete(`/api/delete-song/${song.id}`);

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("This song does not belong to this user");
  expect(await findSongById(song.id)).toBeDefined();
  await otherContext.dispose();
});
