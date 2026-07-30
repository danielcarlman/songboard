"use client";
import { Song } from "@/types";
import { SetStateAction, Dispatch } from "react";
import requestDeleteSong from "@/utils/requestDeleteSong";
export default function DeleteButton({
  songId,
  setSongs,
}: {
  songId: string;
  setSongs: Dispatch<SetStateAction<Song[]>>;
}) {
  return (
    <button
      className="border px-2 py-1 bg-red-500 text-white cursor-pointer"
      onClick={async () => {
        await requestDeleteSong(songId);
        setSongs((currentSongs) =>
          currentSongs.filter((song) => song.id !== songId),
        );
      }}
    >
      Delete Song
    </button>
  );
}
