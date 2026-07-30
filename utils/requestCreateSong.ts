import { createSongInputSchema, errorOutputSchema } from "@/types";

export default async function requestCreateSong(title: string, lyrics: string) {
  const inputData = { title, lyrics };
  const input = createSongInputSchema.parse(inputData);
  const init = { body: JSON.stringify(input), method: "POST" };
  const response = await fetch("/api/create-song", init);
  const outputData = await response.json();
  if (response.ok) {
    return outputData;
  }
  const errorOutput = errorOutputSchema.parse(outputData);
  const error = new Error(errorOutput.message);
  /*
  {
    cause?: string
    name: string
    message: string
    stack?: string
  }
  */
  throw error;
}
