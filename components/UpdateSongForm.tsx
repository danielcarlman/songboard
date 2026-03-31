"use client";

import { errorOutputSchema, Song, updateSongInputSchema } from "@/types";
import clsx from "clsx";
import { useState } from "react";

interface UpdateSongFormProps {
  song: Song;
}

export default function UpdateSongForm({ song }: UpdateSongFormProps) {
  const [title, setTitle] = useState(song.title);
  const [lyrics, setLyrics] = useState(song.lyrics ?? "");
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);
        setIsUpdated(false);
        const data = { title, lyrics };
        const input = updateSongInputSchema.parse(data);
        const init = { body: JSON.stringify(input), method: "PUT" };
        const response = await fetch(`/api/update-song/${song.id}`, init);
        const responseData: unknown = await response.json();
        if (response.ok) {
          setIsUpdated(true);
          setMessage(undefined);
        } else {
          const errorOutput = errorOutputSchema.parse(responseData);
          setIsUpdated(false);
          setMessage(errorOutput.message);
        }
        setIsLoading(false);
      }}
    >
      <fieldset className="flex flex-col gap-2" disabled={isLoading}>
        <input
          placeholder="title"
          className="border py-2 px-4"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setMessage("");
            setIsUpdated(false);
          }}
        />
        <input
          placeholder="lyrics"
          className="border py-2 px-4"
          value={lyrics}
          onChange={(e) => {
            setLyrics(e.target.value);
            setMessage("");
            setIsUpdated(false);
          }}
        />
        <button
          className={clsx(
            "border py-2 px-4 cursor-pointer",
            isLoading && "bg-gray-500",
          )}
          type="submit"
        >
          Update Song
        </button>
        {isUpdated && <p>Song updated successfully</p>}
        {message && <p>{message}</p>}
      </fieldset>
    </form>
  );
}
