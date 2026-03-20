"use client";

export default function DeleteButton({
  songId,
  updateSongs,
}: {
  songId: string;
  updateSongs: (id: string) => void;
}) {
  return (
    <button
      className="border px-2 py-1 bg-red-500 text-white cursor-pointer"
      onClick={async () => {
        const init = { method: "DELETE" };
        const response = await fetch(`/api/delete-song/${songId}`, init);
        if (response.ok) {
          updateSongs(songId);
        }
      }}
    >
      Delete Song
    </button>
  );
}
