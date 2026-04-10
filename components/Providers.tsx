"use client";
import store from "@/redux/store";
import { Provider } from "react-redux";
import AuthContextProvider from "./AuthContextProvider";
import { UserData } from "@/types";
import { ReactNode } from "react";

interface ProvidersProps {
  user?: UserData;
  children: ReactNode;
}

export default function Providers({ user, children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthContextProvider user={user}>{children}</AuthContextProvider>
    </Provider>
  );
}
