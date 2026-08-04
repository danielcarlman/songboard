import requestCreateSong from "@/utils/requestCreateSong";

describe("requestCreateSong", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("posts the title and lyrics to /api/create-song", async () => {
    const song = {
      id: "11111111-1111-4111-8111-111111111111",
      userId: "22222222-2222-4222-8222-222222222222",
      title: "My Title",
      lyrics: "la la",
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(song) }),
    ) as jest.Mock;

    await requestCreateSong("My Title", "la la");

    expect(fetch).toHaveBeenCalledWith(
      "/api/create-song",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "My Title", lyrics: "la la" }),
      }),
    );
  });

  test("returns the created song on success", async () => {
    const song = {
      id: "11111111-1111-4111-8111-111111111111",
      userId: "22222222-2222-4222-8222-222222222222",
      title: "My Title",
      lyrics: "la la",
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(song) }),
    ) as jest.Mock;

    const result = await requestCreateSong("My Title", "la la");
    expect(result).toEqual(song);
  });

  test("throws the server's error message on failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Song already exists" }),
      }),
    ) as jest.Mock;

    await expect(requestCreateSong("My Title", "la la")).rejects.toThrow(
      "Song already exists",
    );
  });

  test("rejects an empty title without calling fetch", async () => {
    global.fetch = jest.fn() as jest.Mock;

    await expect(requestCreateSong("", "la la")).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });

  test("rejects a title over 255 characters without calling fetch", async () => {
    global.fetch = jest.fn() as jest.Mock;

    await expect(
      requestCreateSong("a".repeat(256), "la la"),
    ).rejects.toThrow();
    expect(fetch).not.toHaveBeenCalled();
  });
});
