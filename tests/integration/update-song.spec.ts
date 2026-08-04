import { expect, request as playwrightRequest, test } from "@playwright/test";
import { registerAndLogin } from "../helpers/auth";
import { findSongById } from "../helpers/db";
import { createSong } from "../helpers/song";
import { uniqueTitle } from "../helpers/testData";

test("updates a song owned by the authenticated user", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);
  const newTitle = uniqueTitle();

  const response = await request.put(`/api/update-song/${song.id}`, {
    data: { title: newTitle, lyrics: "new lyrics" },
  });

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ ok: true });

  const updated = await findSongById(song.id);
  expect(updated).toMatchObject({ title: newTitle, lyrics: "new lyrics" });
});

test("rejects an unauthenticated request", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);
  await request.get("/api/logout");

  const response = await request.put(`/api/update-song/${song.id}`, {
    data: { title: uniqueTitle(), lyrics: "new lyrics" },
  });

  expect(response.status()).toBe(400);
});

test("rejects updating a song that does not exist", async ({ request }) => {
  await registerAndLogin(request);

  const response = await request.put(
    "/api/update-song/00000000-0000-0000-0000-000000000000",
    { data: { title: uniqueTitle(), lyrics: "new lyrics" } },
  );

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("This song does not exist");
});

test("rejects updating a song owned by another user", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);

  const otherContext = await playwrightRequest.newContext({
    baseURL: "http://localhost:3000",
  });
  await registerAndLogin(otherContext);

  const response = await otherContext.put(`/api/update-song/${song.id}`, {
    data: { title: uniqueTitle(), lyrics: "new lyrics" },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("This song does not belong to this user");
  await otherContext.dispose();
});

test("rejects a title that collides with another existing song", async ({
  request,
}) => {
  await registerAndLogin(request);
  const takenTitle = uniqueTitle();
  await createSong(request, { title: takenTitle });
  const song = await createSong(request);

  const response = await request.put(`/api/update-song/${song.id}`, {
    data: { title: takenTitle, lyrics: "new lyrics" },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBe("This song title already exists");
});

test("allows a song to keep its own title", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);

  const response = await request.put(`/api/update-song/${song.id}`, {
    data: { title: song.title, lyrics: "new lyrics" },
  });

  expect(response.ok()).toBe(true);
});

test("rejects an empty title", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);

  const response = await request.put(`/api/update-song/${song.id}`, {
    data: { title: "", lyrics: "new lyrics" },
  });

  expect(response.ok()).toBe(false);
  const unchanged = await findSongById(song.id);
  expect(unchanged?.title).toBe(song.title);
});

test("rejects a title over 255 characters", async ({ request }) => {
  await registerAndLogin(request);
  const song = await createSong(request);

  const response = await request.put(`/api/update-song/${song.id}`, {
    data: { title: "a".repeat(256), lyrics: "new lyrics" },
  });

  expect(response.ok()).toBe(false);
  const unchanged = await findSongById(song.id);
  expect(unchanged?.title).toBe(song.title);
});
