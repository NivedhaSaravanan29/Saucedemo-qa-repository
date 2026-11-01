import { test, expect } from './fixtures';

const asc = (a: number, b: number) => a - b;

test('TC06 sort by price low to high orders the whole list', async ({ loggedIn }) => {
  const before = await loggedIn.prices();
  await loggedIn.sortBy('lohi');
  // poll = auto-retrying assertion, no sleeps
  await expect.poll(() => loggedIn.prices()).toEqual([...before].sort(asc));
});

test('TC07 sort by price high to low orders the whole list', async ({ loggedIn }) => {
  const before = await loggedIn.prices();
  await loggedIn.sortBy('hilo');
  await expect.poll(() => loggedIn.prices()).toEqual([...before].sort(asc).reverse());
});

test('TC08 sort by name A to Z orders the whole list', async ({ loggedIn }) => {
  const before = await loggedIn.names();
  await loggedIn.sortBy('za'); // move away from the default first so the test proves a change
  await loggedIn.sortBy('az');
  await expect.poll(() => loggedIn.names()).toEqual([...before].sort((a, b) => a.localeCompare(b)));
});

test('TC09 sort by name Z to A orders the whole list', async ({ loggedIn }) => {
  const before = await loggedIn.names();
  await loggedIn.sortBy('za');
  await expect.poll(() => loggedIn.names()).toEqual([...before].sort((a, b) => b.localeCompare(a)));
});
