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

  test("PC-G-001 - Get User List", async () => {
    const response = await apiContext.get("/api/id");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("PC-G-001 - Get User by Valid ID and Verify Details", async () => {
    // Step 1: Get list of users
    const listResponse = await apiContext.get("/api/id");
    expect(listResponse.status()).toBe(200);

    const users = await listResponse.json();
    const firstUser = users[0];

    // console.log("User pulled from list:", firstUser);

    // Save original details
    const expectedUser = {
      _id: firstUser._id,
      fullName: firstUser.fullName,
      email: firstUser.email,
      phone: firstUser.phone,
    };

    // Step 2: Fetch user by ID
    const getResponse = await apiContext.get(`/api/id/${expectedUser._id}`);
    expect(getResponse.status()).toBe(200);

    const fetchedUser = await getResponse.json(); // this is an object, not an array
    // console.log("User fetched by ID:", fetchedUser);

    // Step 3: Validate that the fetched user matches expected details
    expect(fetchedUser._id).toBe(expectedUser._id);
    expect(fetchedUser.fullName).toBe(expectedUser.fullName);
    expect(fetchedUser.email).toBe(expectedUser.email);
    expect(fetchedUser.phone).toBe(expectedUser.phone);
  });
});
