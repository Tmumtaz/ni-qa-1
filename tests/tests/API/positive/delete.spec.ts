import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { generateUserData } from "../utils/helpers";

test.describe("DELETE", () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: "http://localhost:3001",
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("TC004 - Delete User by Valid Id", async () => {
    // Create a new user first to delete
    const user = generateUserData();
    const createResponse = await apiContext.post("/api/save", { data: user });
    const createdUser = await createResponse.json();

    const deleteResponse = await apiContext.delete(
      `/api/user/${createdUser._id}`
    );
    expect(deleteResponse.status()).toBe(200);
    const deleteBody = await deleteResponse.json();
    expect(deleteBody).toEqual({ deletedCount: 1 });

    // Verify deletion
    const getResponse = await apiContext.get(`/api/id/${createdUser._id}`);
    expect(getResponse.status()).toBe(404);
  });

 

});
