import {
  createSongInputSchema,
  updateSongInputSchema,
  registerInputSchema,
} from "@/types";

describe("createSongInputSchema", () => {
  test("accepts a normal title and lyrics", () => {
    const result = createSongInputSchema.safeParse({
      title: "A normal title",
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(true);
  });

  test("rejects an empty title", () => {
    const result = createSongInputSchema.safeParse({
      title: "",
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(false);
  });

  test("accepts a title exactly 255 characters long", () => {
    const result = createSongInputSchema.safeParse({
      title: "a".repeat(255),
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(true);
  });

  test("rejects a title over 255 characters long", () => {
    const result = createSongInputSchema.safeParse({
      title: "a".repeat(256),
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateSongInputSchema", () => {
  test("accepts a normal title and lyrics", () => {
    const result = updateSongInputSchema.safeParse({
      title: "A normal title",
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(true);
  });

  test("rejects an empty title", () => {
    const result = updateSongInputSchema.safeParse({
      title: "",
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(false);
  });

  test("accepts a title exactly 255 characters long", () => {
    const result = updateSongInputSchema.safeParse({
      title: "a".repeat(255),
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(true);
  });

  test("rejects a title over 255 characters long", () => {
    const result = updateSongInputSchema.safeParse({
      title: "a".repeat(256),
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(false);
  });

  test("rejects a missing title", () => {
    const result = updateSongInputSchema.safeParse({
      lyrics: "some lyrics",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerInputSchema", () => {
  test("accepts a username and password", () => {
    const result = registerInputSchema.safeParse({
      username: "someone",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects a missing password", () => {
    const result = registerInputSchema.safeParse({ username: "someone" });
    expect(result.success).toBe(false);
  });
});
