export default async function requestDeleteSong(songId: string) {
  const init = { method: "DELETE" };
  const response = await fetch(`/api/delete-song/${songId}`, init);
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  throw new Error("Could not delete song");
}
