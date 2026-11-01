import { test as base } from '@playwright/test';
import { config } from '../src/config';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductsPage } from '../src/pages/ProductsPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';

type Pages = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loggedIn: ProductsPage; // products page after a fresh standard-user login
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productsPage: async ({ page }, use) => use(new ProductsPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  loggedIn: async ({ page, loginPage, productsPage }, use) => {
    await loginPage.open();
    await loginPage.login(config.users.standard, config.password);
    await productsPage.expectLoaded();
    await use(productsPage);
  },
});

export { expect } from '@playwright/test';

// Product names used in tests (single place to change if the catalogue changes)
export const ITEMS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
};
