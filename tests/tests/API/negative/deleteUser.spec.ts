import { test, expect } from "@playwright/test";

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

  test("NC-D-001 - Delete user with non-existent ID", async () => {
    const id = "abc";
    const response = await apiContext.delete(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.err;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });

  test("NC-D-002 - Delete user with invalid ID format", async () => {
    const id = 99999;
    const response = await apiContext.delete(`/api/id/${id}`);
    const responseBody = await response.json();
    const errorMessage = responseBody.err;

    expect(errorMessage).toBe("User not found");
    expect(response.status()).toBe(404);
  });

});
