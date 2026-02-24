import authenticate from "@/utils/authenticate";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const result = await authenticate();
  if (!result.authenticated) {
    redirect("/login");
  }
  return <h1>Dashboard. Hi {result.user.username}!</h1>;
}
