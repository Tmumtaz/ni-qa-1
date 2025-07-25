import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { generateUserData } from "../utils/helpers";

test.describe("Concurrent Operations", () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: "http://localhost:3001",
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('SCH-001 - Validate structure of user list response', async () => {
  const res = await apiContext.get('/api/id');
  expect(res.ok()).toBeTruthy();
  expect(res.status()).toBe(200);

  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);

  for (const user of data) {
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('fullName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phone');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  }
});

test('SCH-002 - Validate structure of single user response', async () => {
  const user = generateUserData();
  const createRes = await apiContext.post('/api/save', { data: user });
  const created = await createRes.json();

  const res = await apiContext.get(`/api/id/${created._id}`);
  expect(res.ok()).toBeTruthy();
  expect(res.status()).toBe(200);

  const data = await res.json();
  expect(data).toMatchObject({
    _id: expect.any(String),
    fullName: expect.any(String),
    email: expect.stringMatching(/@/),
    phone: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});

test('SCH-002 - Validate error response structure', async () => {
  const res = await apiContext.get('/api/id/nonexistentid');
  expect(res.status()).toBe(404);

  const body = await res.json();
  expect(body).toMatchObject({
    error: expect.any(String),
  });
});

  
});
