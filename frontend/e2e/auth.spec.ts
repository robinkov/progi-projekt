import { test, expect } from '@playwright/test';

test('registracija i prijava korisnika', async ({ page }) => {

  const randomSuffix = Math.floor(10 + Math.random() * 90); // 10-99
  const firstName = `test${randomSuffix}`;
  const lastName = `test${randomSuffix}`;
  const email = `test${randomSuffix}@example.com`;
  const password = 'TestPassword123';

  // Registracija novog korisnika
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

  // Provjera redirecta nakon registracije
  await expect(page).toHaveURL(/\//);

  // Provjera da je korisnik prijavljen – Navbar prikazuje Logout gumb
  // Čekanje da Logout gumb stvarno postoji i bude vidljiv
  const logoutButton = page.getByRole('button', { name: 'Logout' });
  await logoutButton.waitFor({ state: 'visible', timeout: 10000 }); // čekaj do 10s

  // Odjava
  await logoutButton.click();

  // Dodatno osiguraj da je sesija stvarno "čista" prije odlaska na login stranicu
  await page.context().clearCookies();
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  // Login s istim korisnikom
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

  // Provjera da je korisnik prijavljen
  await expect(logoutButton).toBeVisible();

  // dodatna provjera: provjera imena korisnika
  await expect(page.getByText(`${firstName} ${lastName}`)).toBeVisible();
});
