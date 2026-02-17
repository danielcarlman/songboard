"use client";
import { User } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavBarProps {
  auth:
    | { authenticated: false; message: string }
    | { authenticated: true; user: User };
}

export default function NavBar({ auth }: NavBarProps) {
  const router = useRouter();
  return (
    <nav className="flex bg-blue-700 text-white space-x-4 items-center">
      <Link href="/songs" className="text-xl font-bold">
        Songboard
      </Link>
      <Link href="/create-song">Create Song</Link>

      {auth.authenticated ? (
        <button
          onClick={async () => {
            await fetch("/api/logout/");
            router.push("/login");
          }}
          className="cursor-pointer"
        >
          Logout
        </button>
      ) : (
        <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </nav>
  );
}
