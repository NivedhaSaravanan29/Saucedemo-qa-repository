import { test, expect, ITEMS } from './fixtures';

const cents = (n: number) => Math.round(n * 100);

test('TC14b overview shows item total = product price and total = item total + tax', async ({
  loggedIn, cartPage, checkoutPage,
}) => {
  const [price] = await loggedIn.prices();           // price of the first listed product
  const firstName = (await loggedIn.names())[0];

  await loggedIn.add(firstName);
  await loggedIn.expectBadge(1);                     // proves the item really is in the cart
  await loggedIn.openCart();
  await cartPage.expectItems([firstName]);
  await cartPage.checkout();

  await checkoutPage.fillInfo('Test', 'User', '600001');
  await checkoutPage.continue();
  await checkoutPage.expectOnOverview();

  const { item, tax, total } = await checkoutPage.overviewAmounts();
  expect(cents(item)).toBe(cents(price));            // item total matches the shelf price
  expect(cents(total)).toBe(cents(item) + cents(tax));
});
