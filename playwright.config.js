const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000,
  testDir: './tests', // Directory where tests are located
  retries: 0,         // Number of retries for failed tests
  use: {
    headless: false,  // Set false for launching browser
    trace: 'on',      // Enable trace generation
  //  video: 'retain-on-failure', // Record video for failed tests
  },
});