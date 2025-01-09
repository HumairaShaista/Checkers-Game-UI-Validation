const { expect } = require('@playwright/test');

class BasePage {
    constructor(page) {
      this.page = page;
    }
  
    async navigate(url) {
        // Navigate to the URL and wait for the DOM to load
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
        // logic to wait for the initial game message to appear
        const maxRetries = 3;
        let retries = 0;
      
        while (retries < maxRetries) {
          try {
            await this.page.locator('#message').waitFor({ state: 'visible', timeout: 10000 });
            const messageText = await this.page.locator('#message').textContent();
            
            if (messageText.includes('Select an orange piece to move.')) {
              console.log('Game is ready.');
              return; 
            }
          } catch (error) {
            console.warn(`Message not visible. Refreshing the page... Attempt ${retries + 1}`);
            await this.page.reload({ waitUntil: 'domcontentloaded' });
            retries++;
          }
        }
      
        throw new Error('Failed to load game state after multiple retries.');
      }
      
  
    async getTitle() {
      return this.page.title();
    }
  
    // Method to validate text on screen
    async waitForText(selector, text) {
      await this.page.locator(selector).waitFor({ state: 'visible' });
      await expect(this.page.locator(selector)).toHaveText(text);
    }
  }
  
  module.exports = BasePage;