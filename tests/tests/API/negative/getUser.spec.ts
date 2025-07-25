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

  test("TC011 - Should Get Error for reqeust user with invalid Id", async () => {
    const id = "abc";
    const response = await apiContext.get(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.error;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });

  test("TC012- Should Get Error for non-existent User", async () => {
    const id = 99999;
    const response = await apiContext.get(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.error;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });


});
