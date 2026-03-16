"use client";

import { authContext } from "@/context/authContext";
import {
  AuthContextValue,
  loginInputSchema,
  UserData,
  registerInputSchema,
} from "@/types";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextProviderProps {
  user?: UserData;
  children: ReactNode;
}

export default function AuthContextProvider({
  user,
  children,
}: AuthContextProviderProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | undefined>(user);
  const authenticated = userData != null;

  async function register(username: string, password: string) {
    const data = { username, password };
    const input = registerInputSchema.parse(data);
    const init = { body: JSON.stringify(input), method: "POST" };
    try {
      const response = await fetch("/api/register", init);
      if (response.ok) {
        router.push("/login");
      } else {
        const responseData = await response.json();
        if (response.status === 400) {
          return responseData.message;
        }
      }
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return error.message;
    }
  }

  async function login(username: string, password: string) {
    const userCredentials = { username, password };
    const input = loginInputSchema.parse(userCredentials);
    const init = { body: JSON.stringify(input), method: "POST" };

    try {
      const response = await fetch("/api/login", init);
      if (response.ok) {
        const loggedInUser = await response.json();
        setUserData(loggedInUser);
        router.push("/songs");
      } else {
        const errorData = await response.json();
        return errorData.message;
      }
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      return error.message;
    }
  }

  async function logout() {
    await fetch("/api/logout/");
    setUserData(undefined);
    router.push("/login");
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
