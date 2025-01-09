const { test, expect } = require('@playwright/test');
const CheckersPage = require('../pages/CheckersPage');
const scenarios = require('../data/checkersData.json');


test.describe('Checkers Game Automation', () => {
  test('Validate Default State', async ({ page }) => {
    const checkersPage = new CheckersPage(page);
    await checkersPage.navigate('https://www.gamesforthebrain.com/game/checkers/');
    await checkersPage.validateDefaultState();
  });

  test('Play Valid Moves and Capture Blue Piece After 5 Moves Restart Game', async ({ page }) => {
    const checkersPage = new CheckersPage(page);
    await checkersPage.navigate('https://www.gamesforthebrain.com/game/checkers/');

    for (const move of scenarios.validMoves) {
      if (move.source === scenarios.captureMove.source && move.destination === scenarios.captureMove.destination) {
        await checkersPage.captureBluePiece(move.source, move.destination);
      } else {
        await checkersPage.makeMove(move.source, move.destination);
      }
    }

    await checkersPage.restartGame();
  });

  test('Validate Invalid Move After a Valid Move', async ({ page }) => {
    const checkersPage = new CheckersPage(page);
    
    await checkersPage.navigate('https://www.gamesforthebrain.com/game/checkers/');
    await checkersPage.validateDefaultState();
    // Retrieve valid and invalid moves from JSON
    const validMove = scenarios.validMoves[0];
    const invalidMove = scenarios.invalidMove;

    // Validate the invalid move after a valid move
    await checkersPage.validateInvalidMove(validMove, invalidMove);
  });
});