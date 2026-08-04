import { APIRequestContext } from "@playwright/test";
import { uniqueTitle } from "./testData";

export async function createSong(
  request: APIRequestContext,
  overrides: { title?: string; lyrics?: string } = {},
) {
  const title = overrides.title ?? uniqueTitle();
  const lyrics = overrides.lyrics ?? "some lyrics";
  const response = await request.post("/api/create-song", {
    data: { title, lyrics },
  });
  if (!response.ok()) {
    throw new Error(`Failed to create test song: ${response.status()}`);
  }
  return response.json() as Promise<{
    id: string;
    userId: string;
    title: string;
    lyrics: string | null;
  }>;
}
