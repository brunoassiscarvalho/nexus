const { test, expect } = require("@playwright/test");

test("home page should load", async ({ page, baseURL }) => {
  // baseURL is defined in playwright.config.js; navigate to baseURL
  await page.goto(baseURL || "/");
  // basic smoke check: page loads within timeout and has a body
  const body = await page.locator("body");
  await expect(body).toBeVisible();
});
