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

  test("NC-P-001 - Create user with existing username", async () => {
    const Database = require("../../../../api/database");
    const db = new Database();

    const users = await db.getAllUsers();
    expect(users.length).toBeGreaterThan(0);

    const existingName = users[0].fullName;

    const duplicateUser = {
      name: existingName, 
      email: `unique${Date.now()}@example.com`,
      phone: "1234567890",
    };

    const response = await apiContext.post("/api/save", {
      data: duplicateUser,
    });

    const responseBody = await response.json();
    expect(response.status()).toBe(400);
  });

  test("NC-P-002 - Create user with existing email", async () => {
    const Database = require("../../../../api/database");
    const db = new Database();

    const users = await db.getAllUsers();
    expect(users.length).toBeGreaterThan(0);

    const existingEmail = users[0].email;

    const duplicateUser = {
      name: "Duplicate User",
      email: existingEmail,
      phone: "1234567890",
    };

    const response = await apiContext.post("/api/save", {
      data: duplicateUser,
    });

    expect(response.status()).toBe(400);
  });

  test("NC-P-003 - Missing username", async () => {
    const user = generateUserData();
    const duplicateUser = {
      email: user.email,
      phone: user.phone,
    };

    const response = await apiContext.post("/api/save", {
      data: duplicateUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  });

  test("NC-P-004 - Missing Email", async () => {
    const user = generateUserData();
    const duplicateUser = {
      name: user.fullName,
      phone: user.phone,
    };

    const response = await apiContext.post("/api/save", {
      data: duplicateUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  });

  test("NC-P-005 - Missing Phone", async () => {
    const user = generateUserData();
    const duplicateUser = {
      name: user.fullName,
      email: user.email,
    };

    const response = await apiContext.post("/api/save", {
      data: duplicateUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  });

  test('NC-P-006 -Null fields', async () => {
    const nullUser = {
      name: null,
      email: null,
      phone: null,
    };

    const response = await apiContext.post("/api/save", {
      data: nullUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  });

  test('NC-P-007 - Extra Field set to null', async () => {
    const user = generateUserData();
    const sampleUser = {
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      extraField: null,
    };

    const response = await apiContext.post("/api/save", {
      data: sampleUser,
    });

    
      const responseBody = await response.json();
      const errorMessage = responseBody.err;
      expect(errorMessage).toBe("Missing information");
    
  })

  test('NC-P-008 - Empty String Fields', async() => {
    const nullUser = {
      name: " ",
      email: " ",
      phone: " ",
    };

    const response = await apiContext.post("/api/save", {
      data: nullUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  })

   test('NC-P-009 - Extra Fields', async() => {
    const userdata = generateUserData();
    const user = {
      name: userdata.fullName,
      email: userdata.email,
      phone: userdata.phone,
      extraField: "Extra Field"
    };

    const response = await apiContext.post("/api/save", {
      data: user,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  })

  test('NC-P-010 - Leading spaces', async() => {
    const user = generateUserData();
    const sampleUser = {
      name: "   " + user.fullName,
      email: user.email,
      phone: user.phone,
    };

    const response = await apiContext.post("/api/save", {
      data: sampleUser,
    });

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  })

  test('NC-P-011 - Undefined fields', async () => {
    const nullUser = {
      name: undefined,
      email: undefined,
      phone: undefined,
    };

    const response = await apiContext.post("/api/save", {
      data: nullUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  });

  test('NC-P-012 -XXS Attempt', async () => {
    const user = generateUserData();
    const sampleUser = {
      name: "<script>alert('XSS')</script>" + user.fullName,
      email: user.email,
      phone: user.phone,
    };

    const response = await apiContext.post("/api/save", {
      data: sampleUser,
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    // console.log(responseBody);
    const errorMessage = responseBody.err;
    expect(errorMessage).toBe("Missing information");
  })
});
