"use client";

import { authContext, AuthContextValue } from "@/context/authContext";
import {
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
  const authenticated = userData != null;
  async function register(username: string, password: string) {
    const data = { username, password };
    const input = registerInputSchema.parse(data);
    const init = { body: JSON.stringify(input), method: "POST" };
    await fetch("/api/register", init);
    router.push("/login");
  }
  async function login(username: string, password: string) {
    const userData = { username, password };
    const input = loginInputSchema.parse(userData);
    const init = { body: JSON.stringify(input), method: "POST" };
    const response = await fetch("/api/login", init);
    const outputData = await response.json();
    const output = loginOutputSchema.parse(outputData);
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
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
