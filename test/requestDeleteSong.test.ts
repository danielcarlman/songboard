import requestDeleteSong from "@/utils/requestDeleteSong";

describe("requestDeleteSong", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("sends a DELETE request to /api/delete-song/:id", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ id: "song-123" }) }),
    ) as jest.Mock;

    await requestDeleteSong("song-123");

    expect(fetch).toHaveBeenCalledWith(
      "/api/delete-song/song-123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  test("returns the server output on success", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ id: "song-123" }) }),
    ) as jest.Mock;

    const result = await requestDeleteSong("song-123");
    expect(result).toEqual({ id: "song-123" });
  });

  test("throws on failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "This song does not exist" }),
      }),
    ) as jest.Mock;

    await expect(requestDeleteSong("missing-id")).rejects.toThrow(
      "Could not delete song",
    );
  });
});
