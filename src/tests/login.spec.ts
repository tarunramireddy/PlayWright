import { test, expect, BaseTest } from "../fixtures/index";
import { AllureReporter } from "../utils/index";

test.describe("Login Tests", () => {
  test.beforeAll(async () => {
    await BaseTest.beforeAll();
  });

  test.afterAll(async () => {
    await BaseTest.afterAll();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    await BaseTest.beforeEach(testInfo);
  });

  test.afterEach(async ({ page }, testInfo) => {
    await BaseTest.afterEach(testInfo);
    await BaseTest.takeScreenshotOnFailure(page, testInfo);
  });

  test("should login with valid credentials", async ({
    loginPage,
    homePage,
    testUser,
  }) => {
    AllureReporter.epic("User Authentication");
    AllureReporter.feature("Login");
    AllureReporter.story("Valid Login");
    AllureReporter.severity("critical");
    AllureReporter.description(
      "Test login functionality with valid user credentials"
    );
    AllureReporter.owner("QA Team");
    AllureReporter.tag("smoke");
    AllureReporter.tag("authentication");

    await AllureReporter.step("Navigate to login page", async () => {
      await loginPage.navigate();
      expect(await loginPage.isLoaded()).toBe(true);
    });

    await AllureReporter.step("Verify login form elements", async () => {
      await loginPage.clickLoginWithSystem();
      await loginPage.verifyLoginFormElements();
    });

    await AllureReporter.step("Login with valid credentials", async () => {
      await loginPage.login(testUser.email, testUser.password);
    });

    await AllureReporter.step("Verify successful login", async () => {
      await loginPage.waitForPageLoad();
      await homePage.verifyLoginCheck("allianceAdmin");
    });
  });

  test("should show error for invalid credentials", async ({
    loginPage,
    dataGenerator,
  }) => {
    AllureReporter.epic("User Authentication");
    AllureReporter.feature("Login");
    AllureReporter.story("Invalid Login");
    AllureReporter.severity("normal");
    AllureReporter.description(
      "Test login functionality with invalid credentials"
    );
    AllureReporter.tag("negative");
    AllureReporter.tag("authentication");

    const invalidUser = {
      email: dataGenerator.generateEmail(),
      password: dataGenerator.generatePassword(),
    };

    AllureReporter.parameter("email", invalidUser.email);
    AllureReporter.parameter("password", "[HIDDEN]");

    await AllureReporter.step("Navigate to login page", async () => {
      await loginPage.navigate();
      expect(await loginPage.isLoaded()).toBe(true);
    });

    await AllureReporter.step(
      "Attempt login with invalid credentials",
      async () => {
        await loginPage.clickLoginWithSystem();
        await loginPage.login(invalidUser.email, invalidUser.password);
        await loginPage.verifyErrorMessage();
      }
    );
  });

  test("should navigate to forgot password", async ({ loginPage, page }) => {
    AllureReporter.epic("User Authentication");
    AllureReporter.feature("Login");
    AllureReporter.story("Forgot Password Navigation");
    AllureReporter.severity("normal");
    AllureReporter.description("Test navigation to forgot password page");
    AllureReporter.tag("navigation");

    await AllureReporter.step("Navigate to login page", async () => {
      await loginPage.navigate();
      expect(await loginPage.isLoaded()).toBe(true);
    });

    await AllureReporter.step("Click forgot password link", async () => {
      await loginPage.clickLoginWithSystem();
      await loginPage.clickForgotPassword();
    });

    await AllureReporter.step(
      "Verify navigation to forgot password page",
      async () => {
        await page.waitForURL("**/forgot-password");
        expect(page.url()).toContain("/forgot-password");
      }
    );
  });
});
