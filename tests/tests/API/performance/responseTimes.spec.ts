import { test, expect } from "@playwright/test";
require("dotenv").config();

test("PF-001 - API Response Time is under 500ms", async ({ request }) => {
  const start = Date.now();
  const response = await request.get("/api/id");
  const duration = Date.now() - start;

  console.log(`API response time: ${duration}ms`);
  expect(response.status()).toBe(200);
  expect(duration).toBeLessThan(500);
});

test("PF-002 - UI Page Load Time and Large Resource Detection", async ({ page }) => {
  const url = process.env.USERS_FORM as string;

  const start = Date.now();
  const largeResources: string[] = [];
  page.on("response", async (response) => {
    const size = Number(response.headers()["content-length"]) || 0;
    if (size > 500_000) {
      largeResources.push(`${response.url()} - ${Math.round(size / 1024)} KB`);
    }
  });

  await page.goto(url, { waitUntil: "load" });

  const duration = Date.now() - start;
  console.log(`Page load time: ${duration}ms`);
  expect(duration).toBeLessThan(3000);

  if (largeResources.length > 0) {
    console.warn("⚠️ Large resources detected:");
    largeResources.forEach((res) => console.warn(` - ${res}`));
  }

  expect(largeResources.length).toBeLessThanOrEqual(3);
});

test("PF-003 - DOMContentLoaded under 2s", async ({ page }) => {
  const start = Date.now();
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

  const duration = Date.now() - start;
  console.log(`DOMContentLoaded in: ${duration}ms`);
  expect(duration).toBeLessThanOrEqual(2000);
});

test("PF-004 - API POST /api/save should respond under 500ms", async ({
  playwright,
}) => {
  const requestContext = await playwright.request.newContext({
    baseURL: "http://localhost:3001",
  });

  const userData = {
    fullName: "Performance Test User",
    email: `perfuser${Date.now()}@example.com`,
    phone: "1234567890",
  };

  const start = Date.now();
  const response = await requestContext.post("/api/save", { data: userData });
  const duration = Date.now() - start;

  console.log(`API Response Time: ${duration}ms`);
  expect(response.status()).toBe(200);
  expect(duration).toBeLessThanOrEqual(500);

  await requestContext.dispose();
});
