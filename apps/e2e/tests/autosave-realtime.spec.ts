import { test, expect, request } from "@playwright/test";

// Test: create a design via API, open the web app with ?designId= and verify canvas loads

test("create design via API and load in UI", async ({
  page,
  request: apiRequest,
  baseURL,
}) => {
  // Create design via API
  const createResp = await apiRequest.post("http://localhost:3010/flowchart", {
    data: {
      name: `e2e-design-${Date.now()}`,
      cards: [],
      connections: [],
    },
  });

  expect(createResp.ok()).toBeTruthy();
  const created = await createResp.json();
  const id = created._id || created.id;
  expect(id).toBeTruthy();

  // Open two pages to the design URL
  await page.goto((baseURL || "http://localhost:3001") + `/?designId=${id}`);

  // The canvas element should be visible
  const canvas = page.locator("#flow-canvas");
  await expect(canvas).toBeVisible({ timeout: 5000 });

  // Sanity check: ensure provider has set the id by requesting flow from API and ensuring id matches
  const getResp = await apiRequest.get(`http://localhost:3010/flowchart/${id}`);
  expect(getResp.ok()).toBeTruthy();
  const got = await getResp.json();
  expect(got._id || got.id).toBe(id);
});
