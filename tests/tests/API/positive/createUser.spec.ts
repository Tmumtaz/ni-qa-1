import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { generateUserData } from "../utils/helpers";

test.describe("POST", () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: "http://localhost:3001",
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("PC-C-001 - Create User With Valid Data", async () => {
    const user = generateUserData();

    const response = await apiContext.post("/api/save", {
      data: user,
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("_id");
    expect(body.fullName).toBe(user.fullName);
    expect(body.email).toBe(user.email);
    expect(body.phone).toBe(user.phone);
  });
});
