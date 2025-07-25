import { defineConfig } from '@playwright/test';
require('dotenv').config();  // Load environment variables from .env file

export default defineConfig({
  testDir: '',
  timeout: 10000,
  expect: {
    timeout: 5000,
  },
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL,
    actionTimeout: 3000, // 5s for each action
    navigationTimeout: 15000, // 15s for navigations
  },
   projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  testIgnore: ['tests/API/**'],  use: { browserName: 'firefox' } },
    { name: 'webkit', testIgnore: ['tests/API/**'],  use: { browserName: 'webkit' } },
  ],
  workers: 3
});