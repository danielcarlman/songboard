import { LoginOutput, User } from "@/types";
import { createContext, useContext } from "react";

export interface AuthContextValue {
  authenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  user?: LoginOutput;
}

export const authContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const value = useContext(authContext);
  if (!value) {
    throw new Error(
      "useAuthContext must be used inside the AuthContextProvider",
    );
  }
  return value;
}
