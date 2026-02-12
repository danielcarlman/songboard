"use client";

export default function DeleteButton({ songId }: { songId: string }) {
  return (
    <button
      className="border px-2 py-1 bg-red-500 text-white cursor-pointer"
      onClick={async () => {
        const init = { method: "DELETE" };
        await fetch(`/api/delete-song/${songId}`, init);
      }}
    >
      Delete Song
    </button>
  );
}
