"use client";

import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { Song } from "@/types";
import { useState } from "react";

export default function SongsList({ songs: initialSongs }: { songs: Song[] }) {
  const [songs, setSongs] = useState(initialSongs);

  const updateSongs = (songId: string) => {
    const updatedSongs = songs.filter((song) => song.id !== songId);
    setSongs(updatedSongs);
  };

  return (
    <>
      <h1>Songs:</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <h2>{song.title}</h2>
            <p>{song.lyrics}</p>
            <div className="flex gap-2 items-center">
              <Link
                className="border px-2 py-1 bg-blue-950 text-white cursor-pointer"
                href={`/update-song/${song.id}`}
              >
                Update Song
              </Link>
              <DeleteButton songId={song.id} updateSongs={updateSongs} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
