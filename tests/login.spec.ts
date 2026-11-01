import { test, expect } from './fixtures';
import { config } from '../src/config';

test('TC01 standard user logs in and sees products @smoke', async ({ loginPage, productsPage }) => {
  await loginPage.open();
  await loginPage.login(config.users.standard, config.password);
  await productsPage.expectLoaded();
  await expect(productsPage.items).not.toHaveCount(0);
});

test('TC02 locked-out user sees locked-out error', async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.login(config.users.locked, config.password);
  await loginPage.expectError('this user has been locked out');
  await expect(page).not.toHaveURL(/inventory/);
});

test('TC03 wrong password is rejected', async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.login(config.users.standard, 'wrong_password');
  await loginPage.expectError('do not match any user');
  await expect(page).not.toHaveURL(/inventory/);
});
