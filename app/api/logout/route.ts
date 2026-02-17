import { NextResponse } from "next/server";
import authenticate from "@/utils/authenticate";

export async function GET() {
  const auth = await authenticate();
  if (!auth.authenticated) {
    return NextResponse.json(
      {
        message: auth.message,
      },
      { status: 400 },
    );
  }
  cookieStore.delete("jwt");
  return NextResponse.json({ message: "Logged Out" });
}
