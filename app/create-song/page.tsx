import CreateSongForm from "@/components/CreateSongForm";
import authenticate from "@/utils/authenticate";
import { redirect } from "next/navigation";

export default async function CreateSong() {
  const result = await authenticate();
  if (!result.authenticated) {
    redirect("/login");
  }
  return <CreateSongForm />;
}
