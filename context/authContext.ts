import { AuthContextValue } from "@/types";
import { createContext, useContext } from "react";

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
