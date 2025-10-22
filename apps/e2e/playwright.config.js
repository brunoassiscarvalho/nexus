/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  timeout: 5000, // max time for each test in ms (5s)
  expect: {
    timeout: 2000, // expect() timeout
  },
  use: {
    baseURL: 'http://localhost:3001',
    actionTimeout: 5000,
    navigationTimeout: 5000,
    // default headless is left to project-level settings; CI will use headless chromium project
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', headless: true },
    },
    // Headed Chromium (useful locally when you need a visible browser)
    {
      name: 'chromium-headed',
      use: { browserName: 'chromium', headless: false },
    },
    // Optional: use system Chrome if available
    {
      name: 'chrome',
      use: { channel: 'chrome', headless: false },
    },
  ],
};

module.exports = config;
