"use client";
import { loginInputSchema } from "@/types";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = { username, password };
        const input = loginInputSchema.parse(data);
        const init = { body: JSON.stringify(input), method: "POST" };
        await fetch("/api/login", init);
      }}
    >
      <input
        placeholder="username"
        className="border py-2 px-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        className="border py-2 px-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="border py-2 px-4 cursor-pointer" type="submit">
        Login
      </button>
    </form>
  );
}
