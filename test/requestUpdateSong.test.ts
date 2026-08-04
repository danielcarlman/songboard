import requestUpdateSong from "@/utils/requestUpdateSong";

describe("requestUpdateSong", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("puts the title and lyrics to /api/update-song/:id", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) }),
    ) as jest.Mock;

    await requestUpdateSong("New Title", "new lyrics", "song-123");

    expect(fetch).toHaveBeenCalledWith(
      "/api/update-song/song-123",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ title: "New Title", lyrics: "new lyrics" }),
      }),
    );
  });

  test("returns the server output on success", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) }),
    ) as jest.Mock;

    const result = await requestUpdateSong("New Title", "new lyrics", "song-123");
    expect(result).toEqual({ ok: true });
  });

  test("throws the server's error message on failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "This song does not exist" }),
      }),
    ) as jest.Mock;

    await expect(
      requestUpdateSong("New Title", "new lyrics", "missing-id"),
    ).rejects.toThrow("This song does not exist");
  });

  test("rejects an empty title without calling fetch", async () => {
    global.fetch = jest.fn() as jest.Mock;

    await expect(
      requestUpdateSong("", "new lyrics", "song-123"),
    ).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });

  test("rejects a title over 255 characters without calling fetch", async () => {
    global.fetch = jest.fn() as jest.Mock;

    await expect(
      requestUpdateSong("a".repeat(256), "new lyrics", "song-123"),
    ).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
});
