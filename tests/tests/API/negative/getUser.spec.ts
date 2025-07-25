import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { generateUserData } from "../utils/helpers";

test.describe("GET", () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: "http://localhost:3001",
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("NC-G-001 - Invalid ID format (letters)", async () => {
    const id = "abc";
    const response = await apiContext.get(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.error;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });

  test("NC-G-002 - Non-existent user ID", async () => {
    const id = 99999;
    const response = await apiContext.get(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.error;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });


});
