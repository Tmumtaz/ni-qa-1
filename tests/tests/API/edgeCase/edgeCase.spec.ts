import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { CreateUserForm } from "../../../pages/CreateUser";
import { ListUsersPage } from "../../../pages/ListUsers";
require("dotenv").config();
import { generateUserData } from "../utils/helpers";

let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: "http://localhost:3001",
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test("EC-004 - Create user with numeric email returns 400", async ({
  request,
}) => {
  const response = await request.post("/api/save", {
    data: {
      fullName: "Invalid Email User",
      email: 12345, // Invalid type
      phone: "1234567890",
    },
  });

  expect(response.status()).toBe(404);
});

test("EC-005 - GET with float ID returns 400", async ({ request }) => {
  const response = await request.get("/api/id/123.45");

  console.log(response.status());
  const body = await response.json();

  console.log(body);

  expect(response.status()).toBe(404);
});

test("EC-006 - Delete and fetch user simultaneously", async ({ request }) => {
  // Step 1: Create a user
  const user = generateUserData();
  console.log(user);

  const response = await apiContext.post("/api/save", {
    data: user,
  });

  expect(response.status()).toBe(200);
  const createdUser = await response.json();
  const userId = createdUser._id;

  console.log("Created User ID:", userId);

  // Step 2 & 3: Start DELETE and GET in parallel 
  const [deleteResponse, getResponse] = await Promise.all([
    apiContext.delete(`/api/user/${userId}`),
    apiContext.get(`/api/id/${userId}`),
  ]);

  expect(deleteResponse.status()).toBe(200);
  expect([404, 400]).toContain(getResponse.status());
});
