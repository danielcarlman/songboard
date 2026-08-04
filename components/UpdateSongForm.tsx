"use client";
import { Song } from "@/types";
import requestUpdateSong from "@/utils/requestUpdateSong";
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

        try {
          await requestUpdateSong(title, lyrics, song.id);
          setIsUpdated(true);
          setMessage(undefined);
        } catch (error) {
          setIsUpdated(false);
          if (!(error instanceof Error)) {
            throw new Error("Unknown error");
          }
          setMessage(error.message);
        } finally {
          setIsLoading(false);
        }
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
