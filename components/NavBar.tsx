"use client";
import { useAuthContext } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const auth = useAuthContext();
  const router = useRouter();
  return (
    <nav className="flex bg-blue-700 text-white space-x-4 items-center">
      <Link href="/songs" className="text-xl font-bold">
        Songboard
      </Link>

      {auth.authenticated ? (
        <>
          <Link href="/create-song">Create Song</Link>
          <button
            onClick={async () => {
              await auth.logout();
            }}
            className="cursor-pointer"
          >
            Logout ({auth.user?.username})
          </button>
        </>
      ) : (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </nav>
  );
}
