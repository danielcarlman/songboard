import db from "@/db";
import { usersTable } from "@/schema";
import { loginOutputSchema } from "@/types";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  INVALID_JWT_DATA,
  JWT_SIGNATURE_MISSING,
  USER_NOT_FOUND,
  USER_NOT_LOGGED_IN,
} from "./constants";

export default async function authenticate() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt");
  if (!cookie?.value) {
    return { authenticated: false, message: USER_NOT_LOGGED_IN } as const;
  }
  if (!process.env.JWT_SIGNATURE) {
    return { authenticated: false, message: JWT_SIGNATURE_MISSING } as const;
  }
  const payload = jwt.verify(cookie.value, process.env.JWT_SIGNATURE);
  if (typeof payload !== "object") {
    return { authenticated: false, message: INVALID_JWT_DATA } as const;
  }
  const login = loginOutputSchema.parse(payload);
  const userCondition = eq(usersTable.id, login.id);
  const user = await db.query.usersTable.findFirst({
    where: userCondition,
  });
  if (!user) {
    return { authenticated: false, message: USER_NOT_FOUND } as const;
  }
  return { authenticated: true, user } as const;
}
