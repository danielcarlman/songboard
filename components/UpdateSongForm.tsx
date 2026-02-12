"use client";

import { Song, updateSongInputSchema } from "@/types";
import { useState } from "react";

interface UpdateSongFormProps {
  song: Song;
}

export default function UpdateSongForm({ song }: UpdateSongFormProps) {
  const [title, setTitle] = useState(song.title);
  const [lyrics, setLyrics] = useState(song.lyrics ?? "");
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = { title, lyrics };
        const input = updateSongInputSchema.parse(data);
        const init = { body: JSON.stringify(input), method: "PUT" };
        await fetch(`/api/update-song/${song.id}`, init);
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
        Update Song
      </button>
    </form>
  );
}
