"use client";
import { authContext, useAuthContext } from "@/context/authContext";
import { AUTHENTICATE, useAppDispatch } from "@/redux/store";
import { useState } from "react";
import { UserData } from "@/types";

export default function Login() {
  const dispatch = useAppDispatch();
  const auth = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  return (
    <form
      className="flex flex-col justify-center items-center space-y-4 py-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const message = await auth.login(username, password);
        if (message === "Failed to fetch") {
          setMessage("You're offline");
        } else if (!message) {
          dispatch({
            type: AUTHENTICATE,
            payload: { id: id, username: username },
          });
          setUsername("");
          setPassword("");
        } else {
          setMessage(message);
        }
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
      <p>{message}</p>
    </form>
  );
}
