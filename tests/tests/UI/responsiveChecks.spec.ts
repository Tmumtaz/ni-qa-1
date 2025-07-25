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

  test.describe("Responsive Design", async () => {
    const breakpoints = [
      { name: "mobile", width: 375, height: 667 }, // iPhone 6/7/8
      { name: "tablet", width: 768, height: 1024 }, // Tablet
      { name: "desktop", width: 1366, height: 768 }, // Desktop
      { name: "largeDesktop", width: 1920, height: 1080 }, // Large Desktop
    ];

    breakpoints.forEach((breadkPoint) => {
      test(`User Form Renders Correctly on${breadkPoint.name}`, async () => {
        await page.goto(process.env.BASE_URL);
        await page.setViewportSize({
          width: breadkPoint.width,
          height: breadkPoint.height,
        });
        await createUserForm.verifyUIElements();
      });

      test(`List Users Page Renders Correctly on${breadkPoint.name}`, async () => {
        await page.goto(process.env.USERS_FORM);
        await page.setViewportSize({
          width: breadkPoint.width,
          height: breadkPoint.height,
        });
        await usersList.verifyUsersListElements();
      });
    });
  });
});
