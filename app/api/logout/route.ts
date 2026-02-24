import { NextResponse } from "next/server";
import authenticate from "@/utils/authenticate";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  return NextResponse.json({ message: "Logged Out" });
}
