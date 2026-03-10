"use client";

import { authContext } from "@/context/authContext";
import {
  AuthContextValue,
  loginInputSchema,
  LoginOutput,
  loginOutputSchema,
  registerInputSchema,
} from "@/types";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextProviderProps {
  user?: LoginOutput;
  children: ReactNode;
}

export default function AuthContextProvider({
  user,
  children,
}: AuthContextProviderProps) {
  const router = useRouter();
  const [userData, setUserData] = useState(user);
  const [message, setMessage] = useState<string>();
  const authenticated = userData != null;
  async function register(username: string, password: string) {
    const data = { username, password };
    const input = registerInputSchema.parse(data);
    const init = { body: JSON.stringify(input), method: "POST" };
    const response = await fetch("/api/register", init);
    if (response.ok) {
      router.push("/login");
    } else {
      const responseData = await response.json();
      if (response.status === 400) {
        console.log(responseData.message);
        setMessage(responseData.message);
      }
    }
  }
  async function login(username: string, password: string) {
    const userData = { username, password };
    const input = loginInputSchema.parse(userData);
    const init = { body: JSON.stringify(input), method: "POST" };
    const response = await fetch("/api/login", init);
    const outputData = await response.json();
    const output = loginOutputSchema.parse(outputData);
    console.log("Login output:", output);
    if ("message" in output) {
      alert(output.message);
      return;
    }
    setUserData(output);
    router.push("/songs");
  }
  async function logout() {
    await fetch("/api/logout/");
    router.push("/login");
    setUserData(undefined);
  }
  const value: AuthContextValue = {
    user: userData,
    login,
    authenticated,
    logout,
    register,
    message,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
