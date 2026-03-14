import { Page, expect } from '@playwright/test';

export class FlipkartHomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://www.flipkart.com');
    const closeBtn = this.page.locator('button', { hasText: '✕' });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  }

  async search(query: string) {
    await this.page.fill('input[name="q"]', query);
    await this.page.press('input[name="q"]', 'Enter');
    await this.page.waitForSelector('text=Samsung', { timeout: 10000 });
  }

  async selectFirstSamsungPhone(): Promise<Page> {
    // Wait for the product rating container to appear
    await this.page.waitForSelector('.MKiFS6');
    // Find the parent anchor element for the first product
    const firstProduct = this.page.locator('.MKiFS6').first().locator('xpath=ancestor::a');
    
    // Click and wait for the new tab to open
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      firstProduct.click(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  async clickBuyButton(newPage: Page) {
    // Wait for the floating Buy now div to appear
    await newPage.waitForSelector('div:has-text("Buy now")', { timeout: 10000 });
    // Click the Buy now div
    await newPage.click('div:has-text("Buy now")');
  }

  async enterMobileNumber(newPage: Page, mobileNumber: string) {
    await newPage.waitForSelector('input[type="tel"]', { timeout: 10000 });
    await newPage.fill('input[type="tel"]', mobileNumber);
    // Optionally, click continue or submit if required
    const continueBtn = newPage.locator('button:has-text("CONTINUE")');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }
  }
}
