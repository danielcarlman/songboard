import {
  updateSongInputSchema,
  updateSongOutputSchema,
  errorOutputSchema,
} from "@/types";

export default async function requestUpdateSong(
  title: string,
  lyrics: string,
  songId: string,
) {
  const data = { title, lyrics };
  const input = updateSongInputSchema.parse(data);
  const init = {
    body: JSON.stringify(input),
    method: "PUT",
  };
  const response = await fetch(`/api/update-song/${songId}`, init);
  const outputData: unknown = await response.json();
  if (response.ok) {
    const output = updateSongOutputSchema.parse(outputData);
    return output;
  }
  const errorOutput = errorOutputSchema.parse(outputData);
  const error = new Error(errorOutput.message);
  throw error;
}
