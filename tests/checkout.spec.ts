import { test, expect, ITEMS } from './fixtures';

const cents = (n: number) => Math.round(n * 100); // avoid floating-point comparison errors

test('TC14 full checkout: total = item total + tax, order placed, cart empty @smoke', async ({
  loggedIn, cartPage, checkoutPage,
}) => {
  await loggedIn.add(ITEMS.backpack);
  await loggedIn.add(ITEMS.bikeLight);
  await loggedIn.openCart();
  await cartPage.checkout();
  await checkoutPage.fillInfo('Test', 'User', '600001');
  await checkoutPage.continue();
  await checkoutPage.expectOnOverview();

  const { item, tax, total } = await checkoutPage.overviewAmounts();
  const listed = (await checkoutPage.overviewItemPrices()).reduce((s, p) => s + p, 0);
  expect(cents(item), 'item total equals sum of listed prices').toBe(cents(listed));
  expect(cents(total), 'total equals item total + tax').toBe(cents(item) + cents(tax));

  await checkoutPage.finish();
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  await loggedIn.expectBadge(0);

  await checkoutPage.backHome.click();
  await loggedIn.expectLoaded();
  await loggedIn.openCart();
  await expect(cartPage.items).toHaveCount(0);
});

const missing = [
  { id: 'TC15a', field: 'first name', data: ['', 'User', '600001'], error: 'First Name is required' },
  { id: 'TC15b', field: 'last name', data: ['Test', '', '600001'], error: 'Last Name is required' },
  { id: 'TC15c', field: 'postal code', data: ['Test', 'User', ''], error: 'Postal Code is required' },
];

for (const c of missing) {
  test(`${c.id} missing ${c.field} shows an error and blocks checkout`, async ({
    loggedIn, cartPage, checkoutPage, page,
  }) => {
    await loggedIn.add(ITEMS.backpack);
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(c.data[0], c.data[1], c.data[2]);
    await checkoutPage.continue();
    await expect(checkoutPage.error).toContainText(c.error);
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
}

test('TC17 cancel on the overview page returns to products without placing an order', async ({
  loggedIn, cartPage, checkoutPage, page,
}) => {
  await loggedIn.add(ITEMS.backpack);
  await loggedIn.openCart();
  await cartPage.checkout();
  await checkoutPage.fillInfo('Test', 'User', '600001');
  await checkoutPage.continue();
  await checkoutPage.expectOnOverview();
  await checkoutPage.cancel();
  await loggedIn.expectLoaded();
  await expect(page).not.toHaveURL(/checkout-complete/);
  await loggedIn.expectBadge(1); // item still in cart: nothing was ordered
});
