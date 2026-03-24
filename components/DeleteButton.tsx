"use client";
import { Song } from "@/types";
import { SetStateAction, Dispatch } from "react";
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
        const init = { method: "DELETE" };
        const response = await fetch(`/api/delete-song/${songId}`, init);
        if (response.ok) {
          setSongs((currentSongs) =>
            currentSongs.filter((song) => song.id !== songId),
          );
        }
      }}
    >
      Delete Song
    </button>
  );
}
