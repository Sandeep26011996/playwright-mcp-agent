import { test } from '@playwright/test';
import { FlipkartHomePage } from './pages/FlipkartHomePage';

test('Flipkart search for office chairs', async ({ page }) => {
  const flipkart = new FlipkartHomePage(page);
  await flipkart.goto();
  await flipkart.search('office chairs');
});
