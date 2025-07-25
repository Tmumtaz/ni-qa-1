import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { generateUserData } from "../utils/helpers";

test.describe("DELETE   ", () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: "http://localhost:3001",
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("TC013 - Delete user with invalid ID", async () => {
    const id = "abc";
    const response = await apiContext.delete(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.err;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });

  test("TC014- Delete User with non-existent ID", async () => {
    const id = 99999;
    const response = await apiContext.delete(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.err;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });

});
