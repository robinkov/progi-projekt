import { test, expect } from '@playwright/test';

test('nepostojeca stranica', async ({ page }) => {
  // 1 kreni s pocetne
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveURL('/auth');

  // 2 otvori nepostojeci url
  await page.goto('http://localhost:5173/ovo-ne-postoji-123');
  const errorHeading = page.getByText('404 - Page Not Found');
  await expect(errorHeading).toBeVisible();

  // 3 vrati se sa browser back
  await page.goBack();
  await expect(page).toHaveURL('/auth');
});
