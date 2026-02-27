import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import authenticate from "@/utils/authenticate";
import AuthContextProvider from "@/components/AuthContextProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Songboard",
  description: "Organize your music projects",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await authenticate();
  return (
    <html lang="en">
      <AuthContextProvider user={auth.user}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NavBar />
          {children}
        </body>
      </AuthContextProvider>
    </html>
  );
}
