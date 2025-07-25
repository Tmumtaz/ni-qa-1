import { CreateUserForm } from "../../pages/CreateUser";
import { ListUsersPage } from "../../pages/ListUsers";
import { Page, Locator, test, expect, request } from "@playwright/test";
require("dotenv").config();

test.describe("E2E", () => {
  let page, context, createUserForm, usersList, apiContext;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    createUserForm = new CreateUserForm(page);
    usersList = new ListUsersPage(page);

    apiContext = await request.newContext({
      baseURL: process.env.BASE_API_URL || "http://localhost:3001",
    });
  });

  test.afterEach(async () => {
    await page.close();
    await context.close();
    await apiContext.dispose();
  });

  test("CREATE-01 - Create User", async () => {
    await page.goto(process.env.BASE_URL as string);
    const user = await createUserForm.generateUserData();

    await createUserForm.fillForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    let requestBody: any = null;
    await page.route("**/api/save", async (route, request) => {
      // Capture the request body
      requestBody = JSON.parse(request.postData() || "{}");

      // Continue with the request
      await route.continue();
    });

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/save") && resp.request().method() === "POST"
      ),
      createUserForm.saveButton.click(),
    ]);

    // // 🔍 Assert request payload
    expect(requestBody.fullName).toBe(user.name);
    expect(requestBody.email).toBe(user.email);
    expect(requestBody.phone).toBe(user.phone);

    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody.fullName).toBe(user.name);
    expect(responseBody.email).toBe(user.email);
    expect(responseBody.phone).toBe(user.phone);
    expect(responseBody).toHaveProperty("_id");
    expect(responseBody).toHaveProperty("createdAt");
  });

  test("READ-01 - Read Users", async () => {
    // Wait for the GET /api/id request and capture its response
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/id") && res.request().method() === "GET"
      ),
      page.goto(process.env.USERS_FORM as string),
    ]);

    const responseBody = await response.json();
    // console.log(responseBody);

    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    for (let i = 0; i < responseBody.length; i++) {
      const user = responseBody[i];
      //Verify each piece of data renders on the DOM
      await expect(page.locator(`text=${user.fullName}`)).toBeVisible();
      await expect(
        page.locator(`text=${user.email} | ${user.phone}`)
      ).toBeVisible();
    }
  });

  test("UPDATE-01 - Update User", async () => {
    // 1. Navigate to the users list and wait for the user list API response
    const [listResponse] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/id") && resp.request().method() === "GET"
      ),
      page.goto(process.env.USERS_FORM),
    ]);

    const users = await listResponse.json();
    const firstUserId = users[0]._id;
    console.log("First user ID:", firstUserId);

    // 2. Click the first edit button and wait for the user detail GET API call
    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.request().method() === "GET" &&
          resp.url().includes(`/api/id/${firstUserId}`)
      ),
      usersList.editButton.first().click(),
    ]);

    const userDetails = await response.json();
    console.log("User details from edit API:", userDetails);

    // 3. Generate new user data and fill the form
    const newUser = await createUserForm.generateUserData();
    await createUserForm.fillForm({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    });

    console.log("New user data:", newUser);

    // 4. Click save and wait for the save POST response
    const [editResponse] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes("/api/save") && resp.request().method() === "POST"
      ),
      createUserForm.saveButton.click(),
    ]);

    const editResponseBody = await editResponse.json();

    console.log(editResponseBody);

    // 5. Assertions on the update response
    expect(editResponse.status()).toBe(200);
    expect(editResponseBody).toHaveProperty("_id", firstUserId);
    expect(editResponseBody).toHaveProperty("fullName", newUser.name);
    expect(editResponseBody).toHaveProperty("email", newUser.email);
    expect(editResponseBody).toHaveProperty("phone", newUser.phone);
    expect(editResponseBody).toHaveProperty("updatedAt");
  });

  test("DELETE-01 - Delete User", async () => {
    await page.goto(process.env.USERS_FORM);
    const user = await createUserForm.generateUserData();

    const testUser = {
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      id: "",
    };

    const createResponse = await apiContext.post("/api/save", {
      data: testUser,
    });

    expect(createResponse.status()).toBe(200);
    const createdUser = await createResponse.json();
    testUser.id = createdUser._id;
    // console.log("Created User ID:", testUser.id);

    await page.reload();

    const initialCount = await usersList.userListItems.count();
    // console.log("Initial count:", initialCount);

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes(`/api/user/`) &&
          resp.request().method() === "DELETE"
      ),
      usersList.deleteButton.first().click(),
    ]);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toEqual({ deletedCount: 1 });

    const finalCount = await usersList.userListItems.count();
    expect(finalCount).toBe(initialCount - 1);
  });

  test("DELETE-02 - Delete User From Edit", async () => {
    await page.goto(process.env.USERS_FORM);

    const user = await createUserForm.generateUserData();

    const testUser = {
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      id: "",
    };

    const createResponse = await apiContext.post("/api/save", {
      data: testUser,
    });

    expect(createResponse.status()).toBe(200);
    const createdUser = await createResponse.json();
    testUser.id = createdUser._id;

    // Step 2: Reload page or navigate so user appears in list
    await page.goto(process.env.USERS_FORM);

    const [editResponse] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes(`/api/id/${testUser.id}`) &&
          resp.request().method() === "GET",  
      ),
      usersList.editButton.first().click(), 
    ]);

    expect(editResponse.status()).toBe(200);

    const editUserData = await editResponse.json();
    console.log(editUserData);

    // // Step 4: Validate user data returned by the GET request
    expect(editUserData._id).toBe(testUser.id);
    expect(editUserData.fullName).toBe(testUser.fullName);
    expect(editUserData.email).toBe(testUser.email);
    expect(editUserData.phone).toBe(testUser.phone);

    //Step 5: Click Delete button
    const [deleteResponse] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes(`/api/id/${testUser.id}`) &&
          resp.request().method() === "DELETE"
      ),
      createUserForm.deleteButton.click(),
      page.waitForTimeout(3000),  
    ]);

    expect(deleteResponse.status()).toBe(200);

    const responseBody = await deleteResponse.json();
    expect(responseBody).toEqual({ deletedCount: 1 });

    await expect(createUserForm.nameInput).toBeEmpty();
    await expect(createUserForm.emailInput).toBeEmpty();
    await expect(createUserForm.phoneInput).toBeEmpty();
  });
});
