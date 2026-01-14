import { test, expect } from '@playwright/test';

test('popunjena radionica', async ({ page }) => {
  const randomSuffix = Math.floor(10 + Math.random() * 90); // 10-99
  const firstName = `workshop${randomSuffix}`;
  const lastName = `workshop${randomSuffix}`;
  const email = `workshop${randomSuffix}@test.com`;
  const password = 'TestPassword123';

  // 1 registracija
  await page.goto('http://localhost:5173/auth/register');
  await expect(page).toHaveURL(/\/auth\/register/);

  await page.locator('input[placeholder="First Name"]').fill(firstName);
  await page.locator('input[placeholder="Last Name"]').fill(lastName);
  await page.locator('input[placeholder="Email"]').fill(email);
  await page.locator('input[placeholder="Password"]').fill(password);
  await page.locator('input[placeholder="Repeat password"]').fill(password);

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeEnabled();
  await registerButton.click();

  // 2 odaberi polaznik na /rolechoose stranici
  await expect(page).toHaveURL(/\/rolechoose/);

  const polaznikCard = page.getByRole('heading', { name: 'Polaznik' });
  await polaznikCard.waitFor({ state: 'visible' });
  await polaznikCard.click();

  const continueButton = page.getByRole('button', { name: 'Nastavi' });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page).toHaveURL('http://localhost:5173/');

  // otvori sidebar i klikni radionice
  const menuButton = page.getByRole('button').first();
  await menuButton.click();

  const radioniceButton = page.getByRole('button', { name: 'Radionice' });
  await radioniceButton.click();

  // 3 izaberi radionicu "vrtne figure od gline"
  await expect(page).toHaveURL(/\/workshops/);

  const fullWorkshopLink = page.getByRole('link', { name: /vrtne figure od gline/i });
  await fullWorkshopLink.click();

  // provjeri kapacitet
  const capacityInfo = page.getByText('0 / 0 slobodnih mjesta');
  await expect(capacityInfo).toBeVisible();

  // cekaj disabled gumb 'Popunjeno'
  const popunjenoButton = page.getByRole('button', { name: 'Popunjeno' });
  await expect(popunjenoButton).toBeDisabled();
});
