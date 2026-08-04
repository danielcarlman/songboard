"use client";
import clsx from "clsx";
import { useState } from "react";
import requestCreateSong from "@/utils/requestCreateSong";

export default function CreateSongForm() {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsCreated(false);
        setMessage("");

        try {
          await requestCreateSong(title, lyrics);
          setIsCreated(true);
          setMessage(undefined);
        } catch (error) {
          setIsCreated(false);
          if (!(error instanceof Error)) {
            throw new Error("Unknown error");
          }
          setMessage(error.message);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <input
        placeholder="title"
        className="border py-2 px-4"
        value={title}
        onChange={(e) => {
          setMessage("");
          setTitle(e.target.value);
          setIsCreated(false);
        }}
        disabled={isLoading}
      />
      <input
        placeholder="lyrics"
        className="border py-2 px-4"
        value={lyrics}
        onChange={(e) => {
          setMessage("");
          setLyrics(e.target.value);
          setIsCreated(false);
        }}
        disabled={isLoading}
      />
      <button
        className={clsx(
          "border py-2 px-4 cursor-pointer",
          isLoading && "bg-gray-500",
        )}
        type="submit"
        disabled={isLoading}
      >
        Create Song
      </button>
      {isCreated && <p>Song created successfully</p>}
      {message && <p>{message}</p>}
    </form>
  );
}
