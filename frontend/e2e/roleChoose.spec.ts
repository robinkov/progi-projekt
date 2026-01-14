import { test, expect } from '@playwright/test';

test('odabir uloge', async ({ page }) => {
	const randomSuffix = Math.floor(10 + Math.random() * 90); // 10-99
	const firstName = `role${randomSuffix}`;
	const lastName = `role${randomSuffix}`;
	const email = `role${randomSuffix}@test.com`;
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

	// 2 cekaj redirect /rolechoose i odaberi organizator
	await expect(page).toHaveURL(/\/rolechoose/);

	const organizatorCard = page.getByRole('heading', { name: 'Organizator' });
	await organizatorCard.waitFor({ state: 'visible' });
	await organizatorCard.click();

	const continueButton = page.getByRole('button', { name: 'Nastavi' });
	await continueButton.waitFor({ state: 'visible' });
	await expect(continueButton).toBeEnabled();
	await continueButton.click();

	// 3 cekaj redirect /
	await expect(page).toHaveURL('http://localhost:5173/');

	// 4 provjeri ulogu organizator u navbaru
	const menuButton = page.getByRole('button').first();
	await menuButton.click();

	const membershipButton = page.getByRole('button', { name: 'Članstvo' });
	await expect(membershipButton).toBeVisible();
});

