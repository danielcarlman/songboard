import { APIRequestContext } from "@playwright/test";
import { TEST_PASSWORD, uniqueUsername } from "./testData";

// Registers a fresh test user and logs in on the given request context, so
// its cookie jar carries a valid session for subsequent authenticated calls.
export async function registerAndLogin(request: APIRequestContext) {
  const username = uniqueUsername();
  const registerResponse = await request.post("/api/register", {
    data: { username, password: TEST_PASSWORD },
  });
  if (!registerResponse.ok()) {
    throw new Error(`Failed to register test user: ${registerResponse.status()}`);
  }

  const loginResponse = await request.post("/api/login", {
    data: { username, password: TEST_PASSWORD },
  });
  if (!loginResponse.ok()) {
    throw new Error(`Failed to log in test user: ${loginResponse.status()}`);
  }

  return { username };
}
