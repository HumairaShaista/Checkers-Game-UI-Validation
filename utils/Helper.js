class Helper {
  constructor(page) {
    this.page = page;
  }

  // Capture the state of a specific cell
  async getCellState(cellSelector) {
    const element = await this.page.locator(cellSelector);
    const src = await element.getAttribute('src');
    const name = await element.getAttribute('name');
    return { name, src };
  }

}

module.exports = Helper;