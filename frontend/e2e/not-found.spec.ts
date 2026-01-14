import { test, expect } from '@playwright/test';

test('nepostojeca stranica', async ({ page }) => {
  // 1) Kreni s početne stranice
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveURL('/auth');

  // 2) Otvori URL koji ne postoji
  await page.goto('http://localhost:5173/ovo-ne-postoji-123');

  // 3) Očekujemo render ErrorPage s tekstom "404 - Page Not Found"
  //    (točno prema konfiguraciji u routes/index.ts)
  const errorHeading = page.getByText('404 - Page Not Found');
  await expect(errorHeading).toBeVisible();

  // 4) Navigacija ostaje funkcionalna u smislu da
  //    se korisnik može vratiti na prethodnu stranicu preko browser back akcije.
  await page.goBack();

  // 5) Potvrdi da smo ponovno na početnoj stranici
  await expect(page).toHaveURL('/auth');
});
