import { test, expect } from "@playwright/test";

// Scenario:
// - Navigate to localhost:3001 (baseURL set in config)
// - Go to admin mode, create a new knowledge node with a unique title
// - Save the learning path
// - Switch to user mode
// - Check that the knowledge item appears for users

test("admin can create knowledge node and user sees it", async ({
  page,
  baseURL,
}) => {
  const uniqueId = Date.now();
  const nodeTitle = `E2E Node ${uniqueId}`;

  // Go to app
  await page.goto(baseURL || "/");

  // Click Admin Mode (button labeled 'Admin Mode')
  const adminMode = page.getByRole("button", { name: /admin mode/i }).first();
  if (await adminMode.count()) {
    await adminMode.click();
  } else {
    // fallback to any admin-like control
    const admin = page.getByRole("button", { name: /admin/i }).first();
    if (await admin.count()) await admin.click();
  }

  // Click 'Add Root' to create a new root node
  const addRoot = page.getByRole("button", { name: /add root/i }).first();
  await expect(addRoot).toBeVisible({ timeout: 2000 });
  await addRoot.click();

  // Fill required fields in the Edit Skill panel
  const titleInput = page.getByLabel(/title \*/i).first();
  if (await titleInput.count()) {
    await titleInput.fill(nodeTitle);
  } else {
    // fallback to placeholder
    const placeholderInput = page
      .getByPlaceholder(/e\.g\.,? introduction to reading/i)
      .first();
    if (await placeholderInput.count()) {
      await placeholderInput.fill(nodeTitle);
    } else {
      // last resort: first text input
      await page.locator('input[type="text"]').first().fill(nodeTitle);
    }
  }

  // Fill Short Description and Learning Content if present (best-effort)
  const shortDesc = page.getByLabel(/short description \*/i).first();
  if (await shortDesc.count()) await shortDesc.fill("E2E short description");

  const learningContent = page.getByLabel(/learning content \*/i).first();
  if (await learningContent.count())
    await learningContent.fill("E2E learning content");

  // Save changes
  const saveChanges = page
    .getByRole("button", { name: /save changes/i })
    .first();
  if (await saveChanges.count()) {
    await saveChanges.click();
  } else {
    // fallback to generic Save
    const saveBtn = page.getByRole("button", { name: /save/i }).first();
    if (await saveBtn.count()) await saveBtn.click();
  }

  // Ensure the new node appears in the admin list
  const createdInAdmin = page
    .getByRole("button", { name: new RegExp(nodeTitle) })
    .first();
  await expect(createdInAdmin).toBeVisible({ timeout: 3000 });

  // Switch to user mode
  const userMode = page.getByRole("button", { name: /user mode/i }).first();
  if (await userMode.count()) {
    await userMode.click();
  } else {
    const userBtn = page.getByRole("button", { name: /user/i }).first();
    if (await userBtn.count()) await userBtn.click();
  }

  // On user mode, check that the knowledge item is visible
  await expect(page.getByText(nodeTitle)).toBeVisible({ timeout: 3000 });
});
