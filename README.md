**Repository:** https://github.com/NivedhaSaravanan29/playwright-ecommerce-automation.git

# Sauce Demo – Shop and check out (QA automation)

Playwright + TypeScript tests for the use case *log in, sort, add to cart, check out* on https://www.saucedemo.com.
Manual cases are in [`docs/A1_manual_tests.md`](docs/A1_manual_tests.md). Written answers (Section B) are in [`ANSWERS.md`](ANSWERS.md). AI use is logged in [`AI_USAGE.md`](AI_USAGE.md).

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npx playwright install chromium
cp .env.example .env   # base URL, password and user names; no values live in the tests
```

## Run

```bash
npm test                 # all tests, in parallel
npm run test:smoke       # only tests tagged @smoke
npx playwright test tests/sorting.spec.ts
npm run report           # open the HTML report
```

Reports: `reports/html/index.html` and `reports/junit.xml`. A screenshot (and trace) is saved to `test-results/` for each failed test.

## Structure

```
src/config.ts        env-based config (base URL, users, password) and a price parser
src/pages/           Page Objects: Login, Products, Cart, Checkout (all locators live here)
tests/fixtures.ts    fixtures: page objects and a ready "loggedIn" state
tests/*.spec.ts      tests; each title starts with its manual case ID
```

Design choices: no fixed sleeps (Playwright auto-waiting and `expect.poll`), no retries (so flakiness is visible), every test logs in by itself so tests are independent and can run in any order.

## Traceability: manual case to automated test

| Manual case | Automated test | Spec file |
|---|---|---|
| TC01 | TC01 standard user logs in and sees products | login.spec.ts |
| TC02 | TC02 locked-out user sees locked-out error | login.spec.ts |
| TC03 | TC03 wrong password is rejected | login.spec.ts |
| TC04, TC05 | manual only | – |
| TC06 | TC06 sort by price low to high | sorting.spec.ts |
| TC07 | TC07 sort by price high to low | sorting.spec.ts |
| TC08 | TC08 sort by name A to Z | sorting.spec.ts |
| TC09 | TC09 sort by name Z to A | sorting.spec.ts |
| TC10 | manual only | – |
| TC11 | TC11 add two items, remove one in the cart | cart.spec.ts |
| TC12 | TC12 remove an item from the products page | cart.spec.ts |
| TC13 | manual only | – |
| TC14 | TC14 full checkout | checkout.spec.ts |
| TC15 | TC15a / TC15b / TC15c missing field errors (parameterized) | checkout.spec.ts |
| TC16 | manual only | – |
| TC17 | TC17 cancel on the overview page | checkout.spec.ts |
| TC18 | manual only (waiting for answer to Q3) | – |
| TC19 | TC19 products page by URL after logout | access.spec.ts |
| TC20 | TC20 protected pages by URL (parameterized, 3 paths) | access.spec.ts |
| TC21 – TC25 | manual only | – |

## Assumptions

- Tests use the public site's standard user and locked-out user only; `problem_user` is for manual exploration.
- The tax rate is not hard-coded. The test checks total = item total + tax and item total = sum of listed prices.
- Product names are held in one place (`ITEMS` in `tests/fixtures.ts`).

## How the suite would grow to 200 tests

I would keep the layers separate: Page Objects for screens and small "flow" helpers for repeated journeys, so a UI change is fixed in one place. Tests would be tagged (@smoke, @regression, area tags) so pull requests run the smoke set and the full suite runs nightly, sharded across CI workers. Logging in through the UI would be replaced by a saved login state (`storageState`) and, if the client has an API, test data would be created by API calls, so most tests start at the page under test. Checks that do not need a browser (price maths, validation, auth) would move to API or unit tests. I would track flaky tests in a list with owners and a time limit, keep retries off in CI, and publish the JUnit report to the CI dashboard. Test data would be created per test and cleaned up, so tests stay independent as parallel workers grow.
