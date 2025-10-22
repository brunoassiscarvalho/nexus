const { test, expect } = require('@playwright/test');

test('home page should load', async ({ page, baseURL }) => {
  await page.goto(baseURL || '/');
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
