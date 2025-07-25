import { test, expect } from "@playwright/test";
const db = require("../../../../api/database");
import { CreateUserForm } from "../../../pages/CreateUser";
import { ListUsersPage } from "../../../pages/ListUsers";
require('dotenv').config();



test('Data persists across browser sessions', async ({ browser }) => {
  // Session 1: Create a new user
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();

  const createUserForm1 = new CreateUserForm(page1);
  const usersList1 = new ListUsersPage(page1);

  const newUser = await createUserForm1.generateUserData();

  await page1.goto(process.env.BASE_URL as string);

  await createUserForm1.fillForm({
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
  });

  const [createResponse] = await Promise.all([
    page1.waitForResponse(resp => resp.url().includes('/api/save') && resp.request().method() === 'POST'),
    createUserForm1.saveButton.click(),
  ]);

  expect(createResponse.status()).toBe(200);
  const createdUser = await createResponse.json();

  await context1.close();  // Close first session

  // Session 2: Open new browser context (new session)
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const usersList2 = new ListUsersPage(page2);

  await page2.goto(process.env.USERS_FORM as string);

  // Wait for user list to load and check if the newly created user is present
  const userIsPresent = await page2.locator(`text=${newUser.name}`).isVisible();
  expect(userIsPresent).toBeTruthy();

  await context2.close();
});
