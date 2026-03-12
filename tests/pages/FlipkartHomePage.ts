import { Page, expect } from '@playwright/test';

export class FlipkartHomePage {
  readonly page: Page;
  readonly searchBoxSelector = 'input[title="Search for products, brands and more"], input[placeholder*="Search"], input[type="text"][name="q"], input[type="search"]';
  readonly searchButtonSelector = 'button[type="submit"], button[type="button"]:has(svg), button:has-text("Search")';
  // Selector for product result blocks, skipping banners/ads
  readonly productResultSelector = 'div._1YokD2 ._1AtVbE';
  // Selector for product title inside a result (robust: includes anchor tags and visible only)
  readonly productTitleSelector = 'div._1YokD2 ._1AtVbE ._4rR01T:visible, div._1YokD2 ._1AtVbE .s1Q9rs:visible, div._1YokD2 ._1AtVbE a.s1Q9rs:visible, div._1YokD2 ._1AtVbE a._4rR01T:visible';
  // Fallback selector for summary text above results
  readonly resultsSummarySelector = 'text=Showing 1 –';

  constructor(page: Page) {
    this.page = page;
  }

  async closeLoginPopupIfPresent() {
    // Wait a moment for popup to appear
    await this.page.waitForTimeout(1000);
    const closeBtn = this.page.locator('button._2KpZ6l._2doB4z');
    if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Closing login popup...');
      await closeBtn.click();
      await this.page.waitForTimeout(500);
    } else {
      console.log('Login popup not present.');
    }
  }

  async goto() {
    await this.page.goto('https://www.flipkart.com');
    await this.closeLoginPopupIfPresent();
    await this.page.waitForSelector(this.searchBoxSelector, { timeout: 10000 });
  }

  async search(query: string) {
    // Always close login popup before search (in case it appears again)
    await this.closeLoginPopupIfPresent();
    console.log('Filling search box...');
    await this.page.fill(this.searchBoxSelector, query);
    // Try clicking the search button first
    const button = this.page.locator(this.searchButtonSelector);
    if (await button.isVisible().catch(() => false)) {
      console.log('Clicking search button...');
      await button.click();
    } else {
      // If button not found, try pressing Enter
      console.log('Search button not found, pressing Enter...');
      await this.page.press(this.searchBoxSelector, 'Enter');
    }
    // Wait for navigation or results
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    try {
      // Wait for at least one visible product title (robust for both grid and list views)
      await this.page.waitForSelector(this.productTitleSelector, { timeout: 20000 });
    } catch (e) {
      // Fallback: wait for the summary text above results
      try {
        await this.page.waitForSelector(this.resultsSummarySelector, { timeout: 5000 });
        console.log('Results summary is visible, but product titles are not.');
      } catch (summaryErr) {
        // If neither is visible, log the number and visibility of product cards
        const allCards = await this.page.$$('div._1YokD2 ._1AtVbE');
        let visibleCount = 0;
        for (let i = 0; i < allCards.length; i++) {
          const isVisible = await allCards[i].isVisible();
          if (isVisible) visibleCount++;
          const html = await allCards[i].innerHTML();
          console.log(`._1AtVbE[${i}] visible=${isVisible}:\n` + html);
        }
        console.log(`Total ._1AtVbE cards: ${allCards.length}, visible: ${visibleCount}`);
        throw e;
      }
    }
    console.log('Product title or summary is visible');
  }

  async verifyResults(expected: string) {
  // Get all product titles (robust: includes anchor tags and visible only)
  const titles = await this.page.locator(this.productTitleSelector).allInnerTexts();
  console.log('Found product titles:', titles);
  // At least one title should contain the expected text
  const found = titles.some(t => t.toLowerCase().includes(expected.toLowerCase()));
  expect(found).toBeTruthy();
  }
}
