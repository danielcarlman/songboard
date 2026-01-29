"use client";
import { createSongInputSchema } from "@/types";
import { useState } from "react";

export default function CreateSong() {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = { title, lyrics };
        const input = createSongInputSchema.parse(data);
        const init = { body: JSON.stringify(input), method: "POST" };
        await fetch("/api/create-song", init);
      }}
    >
      <input
        placeholder="title"
        className="border py-2 px-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="lyrics"
        className="border py-2 px-4"
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
      />
      <button className="border py-2 px-4 cursor-pointer" type="submit">
        Create Song
      </button>
    </form>
  );
}
