const BasePage = require('./BasePage');
const Helper = require('../utils/Helper');

const { expect } = require('@playwright/test');

class CheckersPage extends BasePage {
  constructor(page) {
    super(page);
    this.message = '#message'; // Selector for message
    this.restartButton = '//a[text()="Restart..."]'; // Selector for Restart button
    this.rulesButton = '//a[text()="Rules"]'; // Selector for Rules button
    this.orangePiece = 'img[src^="you"]'; // Selector for orange pieces
    this.bluePiece = 'img[src^="me1"]'; // Selector for blue pieces
    this.tiles = 'img[name^="space"]'; // Selector for game tiles 
    this.helper = new Helper(page);
}

async validateDefaultState() {
  // Validation for presence of orange pieces
  const orangeCount = await this.page.locator(this.orangePiece).count();
  expect(orangeCount).toBe(12); 

  // Validation for presence of blue pieces
  const blueCount = await this.page.locator(this.bluePiece).count();
  expect(blueCount).toBe(12); 

  // Validation for tiles are loaded
  const tileCount = await this.page.locator(this.tiles).count();
  expect(tileCount).toBe(64);

  // Validation for the Restart button
  const restartVisible = await this.page.locator(this.restartButton).isVisible();
  expect(restartVisible).toBe(true);

  // Validation for the Rules button
  const rulesVisible = await this.page.locator(this.rulesButton).isVisible();
  expect(rulesVisible).toBe(true);

  // Validate the initial game message
  const messageText = await this.page.locator(this.message).textContent();
  expect(messageText).toContain('Select an orange piece to move.');
}

// Ensure the game is ready for a move
async ensureGameReady() {
    await this.page.locator(this.message).waitFor({ state: 'visible', timeout: 10000 });
    const messageText = await this.page.locator(this.message).textContent();
    if (messageText !== 'Make a move.' && messageText !== 'Select an orange piece to move.') {
      throw new Error(`Unexpected initial message: ${messageText}`);
    }
  }

  // Perform the move
  async performMove(sourceSelector, destinationSelector) {
    await this.page.locator(sourceSelector).click();
    await this.page.locator(destinationSelector).click();
    await this.page.screenshot({ path: `move-${Date.now()}.png` });
  }

  // Wait until the system finishes its move. 
  // This method uses retry logic for "Make a move" message to appear after fininshing moving blue piece.
  async waitForSystemMove() {
    const maxRetries = 20;
    const retryInterval = 5000;

    for (let i = 0; i < maxRetries; i++) {
      const messageText = await this.page.locator(this.message).textContent();
      if (messageText === 'Make a move.') {
        return; 
      }
      console.log(`Waiting for system move... Attempt ${i + 1}`);
      await this.page.waitForTimeout(retryInterval);
    }
    throw new Error('System did not complete its move in time.');
  }

  // Method to make move. This method does below things.
  // 1. Check whether the game is in ready state to make a move.
  // 2. Perform the move by taking source abd destination cell.
  // 3. Wait for the System to make its move.
  async makeMove(sourceSelector, destinationSelector) {
     // Ensure the game is ready
    await this.ensureGameReady();
    console.log('Performing move now')

    await this.performMove(sourceSelector, destinationSelector); 
    console.log('Move performed')
    await this.page.waitForTimeout(2000); 

    // Wait for the system to finish
    await this.waitForSystemMove(); 
  }
  
  
// Method to capture blue piece and check blue piece count after move.
  async captureBluePiece(sourceSelector, destinationSelector) {
    // Get the initial count of blue pieces
  const initialBlueCount = await this.page.locator(this.bluePiece).count();
  console.log(`Initial blue pieces count: ${initialBlueCount}`);

  // Perform the move
  await this.makeMove(sourceSelector, destinationSelector);

  // Get the new count of blue pieces
  const newBlueCount = await this.page.locator(this.bluePiece).count();
  console.log(`New blue pieces count: ${newBlueCount}`);

  // Assert the new count is less than the initial count
  expect(newBlueCount).toBeLessThan(initialBlueCount);
  }

  //Method to make invalid move and verify cell state remains unchanged
  async validateInvalidMove(validMove, invalidMove) {
    // Perform a valid move first
    await this.makeMove(validMove.source, validMove.destination);

    // Capture the source cell state before attempting the invalid move
    const sourceBefore = await this.helper.getCellState(invalidMove.source);

    // Attempt an invalid move
    await this.page.locator(invalidMove.source).click();
    await this.page.locator(invalidMove.destination).click();

    // Capture the source cell state after attempting the invalid move
    const sourceAfter = await this.helper.getCellState(invalidMove.source);

    // Validate that the source cell state remains unchanged
    if (sourceBefore.name !== sourceAfter.name) {
      throw new Error('Invalid move changed the source cell state!');
    }

    console.log('Invalid move did not change the source cell state.');
  }

  // Method to restart game and check orange and blue piece count after restarting game.
  async restartGame() {

    //Click restart
    await this.page.locator(this.restartButton).click();

    //Validation for orange piece count
    const orangeCount = await this.page.locator(this.orangePiece).count();
    console.log(`Orange pieces count: ${orangeCount}`);

    // Assert orange pieces count is 12
    expect(orangeCount).toBe(12); 
  
    // Validation for blue piece count
    const blueCount = await this.page.locator(this.bluePiece).count();
    console.log(`Blue pieces count: ${blueCount}`);

    // Assert blue pieces count is 12
    expect(blueCount).toBe(12); 
  
  }
}

module.exports = CheckersPage;