import { test, expect } from './fixtures';

test('TC19 products page by URL after logout redirects to login with an error @smoke', async ({
  page, loggedIn, loginPage,
}) => {
  await loggedIn.logout();
  await expect(loginPage.loginButton).toBeVisible();

  await page.goto('/inventory.html');
  await expect(page).not.toHaveURL(/inventory\.html/);
  await expect(loginPage.loginButton).toBeVisible();
  await loginPage.expectError("You can only access '/inventory.html' when you are logged in");
});

const protectedPaths = ['/cart.html', '/checkout-step-one.html', '/checkout-complete.html'];

for (const path of protectedPaths) {
  test(`TC20 ${path} cannot be opened when logged out`, async ({ page, loginPage }) => {
    await page.goto(path);
    await expect(loginPage.loginButton).toBeVisible();
    await loginPage.expectError('when you are logged in');
  });
}
