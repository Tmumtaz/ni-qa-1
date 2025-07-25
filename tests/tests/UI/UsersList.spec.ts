import { CreateUserForm } from "../../pages/CreateUser";
import { ListUsersPage } from "../../pages/ListUsers";
import { Page, Locator, test, expect } from "@playwright/test";
require("dotenv").config();

test.describe("Cross-Browser Testing", () => {
  let page, context, createUserForm, usersList;
  test.beforeEach("Setup", async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    createUserForm = new CreateUserForm(page);
    usersList = new ListUsersPage(page);
  });

  test.afterEach("Cleanup", async () => {
    await page.close();
    await context.close();
  });

  test.describe("User Interface", () => {
    test("renders List Users Page", async () => {
      await page.goto(process.env.USERS_FORM);
      await usersList.verifyUsersListElements();
    });

    test("Nav Tabs are active on List Users Page", async () => {
      await page.goto(process.env.USERS_FORM);
      await usersList.verifyNavTabActive(usersList.listUsersTab);
    });
  });
});
