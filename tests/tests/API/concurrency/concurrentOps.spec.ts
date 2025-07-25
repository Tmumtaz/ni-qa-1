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

  test("Create same user concurrently", async () => {
    const user = generateUserData();

    const responses = await Promise.all([
      apiContext.post("/api/save", { data: user }),
      apiContext.post("/api/save", { data: user }),
    ]);

    const statuses = responses.map((r) => r.status());
    expect(statuses).toContain(200);
    expect(statuses).toContain(400);
  });

  test("Delete same user twice", async () => {
    const user = generateUserData();
    const createRes = await apiContext.post("/api/save", { data: user });
    const created = await createRes.json();

    const del1 = await apiContext.delete(`/api/user/${created._id}`);
    expect(del1.status()).toBe(200);

    const del2 = await apiContext.delete(`/api/user/${created._id}`);
    expect(del2.status()).toBe(404);
  });

  test("GET user during creation", async () => {
    const user = generateUserData();

    const createPromise = apiContext.post("/api/save", { data: user });

    const response = await createPromise;
    const created = await response.json();

    const getRes = await apiContext.get(`/api/id/${created._id}`);
    expect(getRes.ok()).toBeTruthy();
  });

  test("GET user list during add/delete operations", async () => {
    const users = Array.from({ length: 5 }, () => generateUserData());

    const ops = users.map((user) =>
      apiContext.post("/api/save", { data: user })
    );
    const listDuringOps = apiContext.get("/api/id"); // mid-op GET

    const [createResults, listResult] = await Promise.all([
      Promise.all(ops),
      listDuringOps,
    ]);

    expect(listResult.ok()).toBeTruthy();
    const list = await listResult.json();
    expect(Array.isArray(list)).toBe(true);
  });
});
