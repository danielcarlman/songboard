import { expect, test } from "@playwright/test";
import { TEST_PASSWORD, uniqueTitle, uniqueUsername } from "../helpers/testData";
import { registerAndLogin } from "../helpers/auth";

test.describe("POST /api/register", () => {
  test("registers a new user", async ({ request }) => {
    const username = uniqueUsername();
    const response = await request.post("/api/register", {
      data: { username, password: TEST_PASSWORD },
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body).toMatchObject({ username });
    expect(body.id).toBeTruthy();
  });

  test("rejects a username that is already taken", async ({ request }) => {
    const username = uniqueUsername();
    await request.post("/api/register", {
      data: { username, password: TEST_PASSWORD },
    });

    const response = await request.post("/api/register", {
      data: { username, password: TEST_PASSWORD },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Username not available");
  });
});

test.describe("POST /api/login", () => {
  test("logs in with correct credentials", async ({ request }) => {
    const username = uniqueUsername();
    await request.post("/api/register", {
      data: { username, password: TEST_PASSWORD },
    });

    const response = await request.post("/api/login", {
      data: { username, password: TEST_PASSWORD },
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body).toMatchObject({ username });
  });

  test("rejects an unregistered username", async ({ request }) => {
    const response = await request.post("/api/login", {
      data: { username: uniqueUsername(), password: TEST_PASSWORD },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Username is not registered");
  });

  test("rejects an incorrect password", async ({ request }) => {
    const username = uniqueUsername();
    await request.post("/api/register", {
      data: { username, password: TEST_PASSWORD },
    });

    const response = await request.post("/api/login", {
      data: { username, password: "WrongPassword123!" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.message).toBe("Password is incorrect");
  });
});

test.describe("GET /api/logout", () => {
  test("clears the session so authenticated requests fail afterwards", async ({
    request,
  }) => {
    await registerAndLogin(request);

    const logoutResponse = await request.get("/api/logout");
    expect(logoutResponse.ok()).toBe(true);

    const createResponse = await request.post("/api/create-song", {
      data: { title: uniqueTitle(), lyrics: "x" },
    });
    expect(createResponse.status()).toBe(400);
  });
});
