import { test, expect } from '@playwright/test';

test('search and add cucumber to cart @regression', async ({ page }) => {
  // 1. Navigate to the website
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

  // 2. Search for cucumber
  await page.fill('.search-keyword', 'cucumber');
  await page.waitForTimeout(1000); // wait for search results to update

  // 3. Verify result
  const product = page.locator('.products .product:has-text("Cucumber")');
  await expect(product).toBeVisible();

  // 4. Add cucumber to the cart
  await product.locator('text=ADD TO CART').click();

  // Open the cart and verify "Cucumber" is present
  await page.click('.cart-icon');
  await page.click('text=PROCEED TO CHECKOUT');
  // Wait for the checkout page to load and verify the product is listed
  const checkoutProduct = page.locator('tr:has-text("Cucumber")');
  await expect(checkoutProduct).toBeVisible();
});
