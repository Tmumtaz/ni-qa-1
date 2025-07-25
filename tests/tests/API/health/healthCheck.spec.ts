import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");

test.describe("Health Check", () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: "http://localhost:3001",
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

   test("TC005 - Health Check", async () => {
    const response = await apiContext.get("/health");
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toMatch(/ok/i);
  });
})
  

  
