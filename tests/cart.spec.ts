import { test, ITEMS } from './fixtures';

test('TC11 add two items, remove one in the cart: badge and contents update @smoke', async ({
  loggedIn, cartPage,
}) => {
  await loggedIn.add(ITEMS.backpack);
  await loggedIn.add(ITEMS.bikeLight);
  await loggedIn.expectBadge(2);

  await loggedIn.openCart();
  await cartPage.expectItems([ITEMS.backpack, ITEMS.bikeLight]);

  await cartPage.remove(ITEMS.backpack);
  await cartPage.expectItems([ITEMS.bikeLight]);
  await loggedIn.expectBadge(1);
});

test('TC12 remove an item from the products page: badge clears', async ({ loggedIn }) => {
  await loggedIn.add(ITEMS.backpack);
  await loggedIn.expectBadge(1);
  await loggedIn.remove(ITEMS.backpack);
  await loggedIn.expectBadge(0);
});
