import { test, expect } from '@playwright/test';

test('registracija i prijava', async ({ page }) => {
test('registracija i prijava', async ({ page }) => {

  const randomSuffix = Math.floor(10 + Math.random() * 90); // 10-99
  const firstName = `register${randomSuffix}`;
  const lastName = `register${randomSuffix}`;
  const email = `register${randomSuffix}@test.com`;
  const firstName = `register${randomSuffix}`;
  const lastName = `register${randomSuffix}`;
  const email = `register${randomSuffix}@test.com`;
  const password = 'TestPassword123';

  // registracija novog korisnika
  await page.goto('http://localhost:5173/auth/register');
  await expect(page).toHaveURL(/\/auth\/register/);

  const firstNameInput = page.locator('input[placeholder="First Name"]');
  const lastNameInput = page.locator('input[placeholder="Last Name"]');
  const emailInput = page.locator('input[placeholder="Email"]');
  const passwordInput = page.locator('input[placeholder="Password"]');
  const repeatPasswordInput = page.locator('input[placeholder="Repeat password"]');
  const registerButton = page.getByRole('button', { name: 'Register' });

  await firstNameInput.waitFor({ state: 'visible' });
  await firstNameInput.fill(firstName);

  await lastNameInput.waitFor({ state: 'visible' });
  await lastNameInput.fill(lastName);

  await emailInput.waitFor({ state: 'visible' });
  await emailInput.fill(email);

  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(password);

  await repeatPasswordInput.waitFor({ state: 'visible' });
  await repeatPasswordInput.fill(password);

  await registerButton.click();

  // cekaj redirect na /rolechoose
  await expect(page).toHaveURL(/\/rolechoose/);

  // odabir uloge i nastavak
  const polaznikCard = page.getByRole('heading', { name: 'Polaznik' });
  await polaznikCard.waitFor({ state: 'visible' });
  await polaznikCard.click();

  const continueButton = page.getByRole('button', { name: 'Nastavi' });
  await continueButton.waitFor({ state: 'visible' });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  // cekaj redirect na /
  await expect(page).toHaveURL(/\//);

  // provjeri logout gumb u navbaru
  const logoutButton = page.getByRole('button', { name: 'Logout' });
  await logoutButton.waitFor({ state: 'visible', timeout: 10000 });
  await logoutButton.waitFor({ state: 'visible', timeout: 10000 });

  // odjava
  await logoutButton.click();

  // pricekaj da se odjava/redirect dovrsi
  await page.waitForURL(/localhost:5173\/auth/, { timeout: 10000 });

  // login istog korisnika
  await page.goto('http://localhost:5173/auth/login');
  await expect(page).toHaveURL(/\/auth\/login/);

  const loginEmailInput = page.locator('input[placeholder="Email"]');
  const loginPasswordInput = page.locator('input[placeholder="Password"]');
  const loginButton = page.getByRole('button', { name: 'Login' });

  await loginEmailInput.waitFor({ state: 'visible' });
  await loginEmailInput.fill(email);

  await loginPasswordInput.waitFor({ state: 'visible' });
  await loginPasswordInput.fill('TestPassword123');

  await loginButton.click();

  // provjeri login i ime korisnika
  await expect(logoutButton).toBeVisible();
  await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
});
