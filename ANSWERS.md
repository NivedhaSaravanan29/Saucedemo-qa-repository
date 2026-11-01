# Section B answers (and Section C notes)

## B1. Review of the AI-generated test

### Problems found

1. **Weak assertion.** `expect(total).toBeTruthy()` passes for any text, even "Total: $0.00" or a wrong amount. The title says "cart total is correct" but nothing is compared with an expected value.
2. **Fixed sleep.** `waitForTimeout(3000)` slows every run and still can fail on a slow day. Playwright waits for elements by itself.
3. **Ambiguous locator.** `text=Add to cart` matches six buttons; the test clicks whichever comes first, so it depends on page order and does not say which product was added.
4. **Fragile selectors.** CSS ids and classes (`.shopping_cart_link`, `#checkout`) break with styling changes. The site offers `data-test` attributes, and roles are better still.
5. **Hard-coded config.** The URL, user name and password are written into the test. They belong in config or environment variables.
6. **No page objects or fixtures.** Login and navigation steps are repeated inline and will be copied into every new test.
7. **Nothing checks the steps succeeded.** No check that login worked, that the item is in the cart (badge or cart page) or that the overview page was reached; a failure would show up later as a confusing timeout.
8. **No known expected value.** The price of the chosen product is never read, so tax and total cannot be checked.
9. **Unparsed text.** `textContent()` returns a label like "Total: $43.18", which cannot be compared to a number without parsing.
10. **Weak test data and naming.** "A", "B" and "1" tell the reader nothing, and the title does not name what rule is tested.

### Rewrite

```ts
// tests/checkout-total.spec.ts  (uses the page objects and fixtures in this repo)
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
```
`ITEMS` is imported only if a fixed product is wanted; the base URL, user and password come from `.env` through the fixture. There is no sleep: each action waits for its element, and each assertion retries automatically.

## B2. Testing an AI feature – Scenario 3: Test case generator

| # | Check in the evaluation set | How it is built | Scoring |
|---|---|---|---|
| 1 | **Coverage.** Every acceptance criterion in a set of 30+ user stories (with known criteria) has at least one generated case, including negative and boundary cases. | Each story in the set comes with a list of criteria. Run the generator, then map cases to criteria. | **Rubric** (criteria covered / total, plus a negative and boundary case present). Mapping can be semi-automated, with a human spot-check of a sample. |
| 2 | **Invented requirements.** No case relies on rules not in the story (for example "password must be 12 characters" when the story is silent). Include stories with deliberate gaps. | Each case's expected result must be traceable to a sentence in the story, or marked as an assumption. | **Human review** against a rubric on a sample; an LLM judge may pre-screen, but a person confirms the failures. |
| 3 | **Duplicates.** No two cases test the same thing, and re-running does not produce near-copies. | Compare cases within one output using text similarity (or embeddings) and a threshold. | **Automatic**: pass if no pair is above the threshold; borderline pairs go to a person. |
| 4 | **Format validity.** Output always matches the JSON schema the import expects: required fields, allowed values, no extra text, correct escaping. | Run 100+ inputs, including very long stories, empty input, quotes and non-English text. Validate with a JSON schema, then a dry-run import into a sandbox of the management tool. | **Automatic**: 100% must parse and validate; any failure blocks release. |

## B3. Defect report

**Title:** Sort "Price (low to high)" shows $29.99 item before $15.99 item (since 4.2.0)

**Environment:** Release 4.2.0; Chrome (version: 156.0.8078.74); 
Microsoft Windows 11 [Version 10.0.26200.9818]; user standard_user; URL : https://www.saucedemo.com/inventory.html. (Login at https://www.saucedemo.com) 

**Steps to reproduce**
1. Log in as a standard user.
2. On the Products page, open the sort drop-down.
3. Select "Price (low to high)".
4. Read the prices from top to bottom.

**Expected result:** Prices ascend from the lowest to the highest, so $15.99 appears before $29.99.

**Actual result:** An item priced $29.99 appears before an item priced $15.99. Reproduces on every run since 4.2.0. Not seen on the previous release (4.1.x).

**Severity: Major (S2).** Sorting by price is a stated core feature and shoppers rely on it to compare products, so wrong results mislead them. It does not stop checkout, no data is lost, and the products can still be found by other means, which is why it is not Critical.

**Evidence to attach:** screenshot of the sorted list with the two items marked; short screen recording of the steps; the full list of prices in the order shown; browser console log and the network response for the products if the sort uses a call; build/release number; the result of the same steps on 4.1.x for comparison.

## B4. Message to the product manager (under 150 words)

> Hi manager, an update before Friday's release.
>
> Our test run found two issues:
> 1. Sorting by "Price (low to high)" puts a $29.99 item above a $15.99 one. It happens every time since 4.2.0.
> 2. Checkout fails about once in 10 instances and then works on retry. We are still tracking its cause.
>
> **My recommendation:** Let's hold the release until the sorting fix is in and checkout issue is diagnosed(if required fixed). I can turn these around by Friday midday if the fix arrives tomorrow.
>
> **Alternative:** If urgent, release Friday with price sorting hidden, a rollback plan ready, and checkout monitored closely on number of failures during checkout. This carries some risk, because the checkout issue could still affect customers' orders.
>
> Could we take ten minutes today to decide?

## Section C – notes for the live discussion

### C1. From "checkout is failing for some users" to root cause

1. **Ask first (5 minutes):** What exactly do they see (error text, screenshot)? Since when (time of first report)? Which users: all, a region, one browser or device, one payment method, new or returning? How many? Can they still order by any other route? Is anything business-critical blocked (so severity is clear)?
2. **Check what changed:** releases, config changes, feature flags, third-party outages (payment provider status page), and certificate or infrastructure changes around the start time.
3. **Look at evidence:** monitoring and error-rate graphs for the checkout, application and gateway logs filtered by time and error code, failed-order counts per segment, and the latest automated test results.
4. **Reproduce and narrow down:** try the same steps on the reported setup (browser, user type, data). Change one thing at a time: user, browser, item, payment method, environment. Compare a failing and a working user.
5. **Product defect or data/environment issue?** A defect fails for everyone with the same steps and started with a release or code change. A data problem follows specific records (an account, a product, a country). An environment problem follows the infrastructure: another environment works, a dependency is down, timeouts or certificates appear in logs. Rollback or a retest in a clean environment helps confirm.
6. **Update the client:** acknowledge quickly (within minutes), then give a short status at an agreed interval (even "no change yet"): what is known, what is not, the impact and the next update time. Raise a clear flag if a rollback or workaround is needed. Finish with a short summary: cause, fix, and prevention.

### C2. A recent production issue you found

**Do not use anyone else's story here. Write your own and keep it truthful.** Notes template:

1. **What happened / how found / impact:** There were conversion failures for only input format of pdf. Alarms went off as success rate dropped. Customers using pdf format books were getting affected.
2. **Root cause and how you found it:** There were multiple pdf related feature changes and resource migrations went into production then. Hence I tried running pdf format books in separate builds while checking logs simultaneously. After 20 minutes of debugging, the issue was found to be due to older EC2 instances used in production due to shortage in memory as the new resource migration needed more space to process. As the prod traffic was low and the most traffic was with pdf as input, pdf conversion alarm has went off.
3. **Explaining it to the client** (who, how soon, what you said, non-technical impact): As soon as the alarm went off, we pitched into a meeting with the managers to check on the impact and time box each task. I tried approaching the issue from multiple perspectives and resolving it sooner to minimize the customer impact.
4. **Prevention** (tests, monitoring, checks, process) and whether it has caught anything since: Migrating to new EC2 instances in production as soon as tested in gamma/ staging environments using a CM would be recommended.
5. **What I would do differently:** During production release, dialling up few percent of customer traffic at a time would help us reduce the impact and catch the issue faster if there are any issues