"use client";
import clsx from "clsx";
import { createSongInputSchema } from "@/types";
import { useState } from "react";

export default function CreateSongForm() {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = { title, lyrics };
        const input = createSongInputSchema.parse(data);
        const init = { body: JSON.stringify(input), method: "POST" };
        const response = await fetch("/api/create-song", init);
        setIsCreated(response.ok);
        setIsLoading(false);
      }}
    >
      <input
        placeholder="title"
        className="border py-2 px-4"
        value={title}
        onChange={(e) => {
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
    </form>
  );
}
