import { test } from '@playwright/test';
import { FlipkartHomePage } from '../pages/FlipkartHomePage';

test('Order a Samsung 5G Android phone and handle mobile number prompt @smoke', async ({ page }) => {
  const flipkart = new FlipkartHomePage(page);
  await flipkart.goto();
  await flipkart.search('Samsung 5G Android phone');
  const newPage = await flipkart.selectFirstSamsungPhone();
});