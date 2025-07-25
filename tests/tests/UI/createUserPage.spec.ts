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
    test("renders Home Page + User Form by Default", async () => {
      await page.goto(process.env.BASE_URL);
      await createUserForm.verifyUIElements();
    });

    test("Nav Tabs are active on Home Page", async () => {
      await page.goto(process.env.BASE_URL);
      await createUserForm.verifyNavTabActive(createUserForm.createUserTab);
    });
  });

  test.describe("Form Validations", async () => {
    //User name should be more than 2 characters
    test("User name should be more than 2 characters", async () => {
      await createUserForm.fillForm({
        name: "te",
        email: "test@example.com",
        phone: "1234567890",
      });
      await createUserForm.saveButton.click();
      await expect(createUserForm.userNameRequiredNotice).toBeVisible();
    });

    test("User name already Exists", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "test@example.com",
        phone: "1234567890",
      });
      await createUserForm.saveButton.click();
      await expect(createUserForm.userNameExistsError).toBeVisible();
    });

    //Email format
    test("User should not be able to register with invalid email", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "test@example",
        phone: "1234567890",
      });
      await createUserForm.saveButton.click();
      await expect(createUserForm.emailRequiredNotice).toBeVisible();
    });

    //Email is taken
    test("User should not be able to register with email that already exists", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "test@example.com",
        phone: "1234567890",
      });
      await createUserForm.saveButton.click();
      await expect(createUserForm.emailExistsError).toBeVisible();
    });

    //Phone Format
    test("User should not be able to register with invalid phone number", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "test@example.com",
        phone: "123456789",
      });
      await createUserForm.saveButton.click();
      await expect(createUserForm.phoneRequiredNotice).toBeVisible();
    });
  });

  test.describe("Error Message Display", () => {
    test("Should get a required error if all fields left empty", async () => {
      await createUserForm.fillForm();
      await createUserForm.saveButton.click();

      // Error Messages
      await expect(createUserForm.userNameRequiredNotice).toBeVisible();
      await expect(createUserForm.emailRequiredNotice).toBeVisible();
      await expect(createUserForm.phoneRequiredNotice).toBeVisible();
    });

    test("Submit with Empty Name Only", async () => {
      await createUserForm.fillForm({
        name: "",
        email: "test@example.com",
        phone: "1234567890",
      });
      await createUserForm.saveButton.click();

      await expect(createUserForm.userNameRequiredNotice).toBeVisible();
      await expect(createUserForm.emailRequiredNotice).not.toBeVisible();
      await expect(createUserForm.phoneRequiredNotice).not.toBeVisible();
    });

    test("Submit with Empty Email only", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "",
        phone: "1234567890",
      });
      await createUserForm.saveButton.click();

      await expect(createUserForm.userNameRequiredNotice).not.toBeVisible();
      await expect(createUserForm.emailRequiredNotice).toBeVisible();
      await expect(createUserForm.phoneRequiredNotice).not.toBeVisible();
    });

    test("Submit with Empty Phone only", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "test@example.com",
        phone: "",
      });
      await createUserForm.saveButton.click();

      await expect(createUserForm.userNameRequiredNotice).not.toBeVisible();
      await expect(createUserForm.emailRequiredNotice).not.toBeVisible();
      await expect(createUserForm.phoneRequiredNotice).toBeVisible();
    });

    test("Shows Server Error when POST request fails", async () => {
      await createUserForm.fillForm({
        name: "test",
        email: "test@example.com",
        phone: "1234567890",
      });

      // Intercept POST /api/save and mock 500 error response
      await page.route("**/api/save", (route) => {
        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Internal Server Error" }),
        });
      });

      await createUserForm.saveButton.click();
    });
  });

  test("Form Fields Should Clear After Valid Submission", async () => {
    await createUserForm.fillForm({
      name: "test",
      email: "test@example.com",
      phone: "1234567890",
    });
    await createUserForm.saveButton.click();

    //success Notice shows on success
    await expect(createUserForm.successNotice).toBeVisible();

    //form fields clear after submission
    await expect(createUserForm.nameInput).toBeEmpty();
    await expect(createUserForm.emailInput).toBeEmpty();
    await expect(createUserForm.phoneInput).toBeEmpty();
  });
});
