# A1. Manual test suite – Shop and check out (Sauce Demo)

## 1. Questions and assumptions

| # | Question for the product owner | Assumption I test against if there is no answer |
|---|---|---|
| Q1 | Is the postal code validated for format or length? | Any non-empty value is accepted (as the rules only say "needs" it). Odd values are logged as observations. |
| Q2 | Is whitespace-only text accepted as a name or postal code? | It should be rejected, same as empty. |
| Q3 | Can a user check out with an empty cart? | No. Checkout should be blocked or the button disabled. |
| Q4 | How is tax calculated and rounded (rate, per item or on the total)? | One flat rate on the item total, rounded to the nearest cent. I check total = item total + tax. |
| Q5 | Does the cart persist after logout/login or after a page reload? | Cart survives a reload in the same session; behaviour after logout is not specified, so I only record it. |
| Q6 | Which browsers, devices and screen sizes are supported? | Latest Chrome desktop is in scope; Firefox, Safari and a 375px phone width get a basic pass. |
| Q7 | Is the login case-sensitive, and is there a lockout after repeated failures? | Username and password are case-sensitive; no lockout is implemented. |
| Q8 | What should happen for the "known problem" users (problem, performance, error, visual)? | They are demo users with intentional defects, so failures there are expected and used for exploration. |

## 2. Test cases

| ID | Area | Type | Title | Pre-conditions | Steps | Test data | Expected result | Priority | Automate? |
|---|---|---|---|---|---|---|---|---|---|
| TC01 | Login | Positive | Standard user logs in | On login page | 1. Enter username 2. Enter password 3. Click Login | standard_user / secret_sauce | Products page shown with the item list | P1 | Yes – smoke test on every build |
| TC02 | Login | Negative | Locked-out user is blocked | On login page | Log in as the locked-out user | locked_out_user / secret_sauce | Error "Sorry, this user has been locked out."; stays on login | P1 | Yes – business rule, cheap and stable |
| TC03 | Login | Negative | Wrong password rejected | On login page | Log in with a wrong password | standard_user / wrong | Error "do not match any user"; no session | P1 | Yes – core security rule |
| TC04 | Login | Negative | Empty username or empty password | On login page | 1. Leave a field empty 2. Click Login | blank user; blank password | "Username is required" / "Password is required" | P2 | No – low value in UI; unit-level validation is enough. Manual pass only |
| TC05 | Login | Boundary | Case and whitespace in credentials | On login page | Try "Standard_User", " standard_user", trailing space | variants | All rejected (assumption Q7) | P3 | No – exploratory, rarely regresses |
| TC06 | Sorting | Positive | Price low to high | Logged in as standard | Sort by "Price (low to high)" | all items | Whole list in ascending price order | P1 | Yes – checks full list, known defect area |
| TC07 | Sorting | Positive | Price high to low | Logged in | Sort by "Price (high to low)" | all items | Whole list in descending price order | P1 | Yes – same helper as TC06 |
| TC08 | Sorting | Positive | Name A to Z | Logged in | Choose Z-A, then A-Z | all items | Whole list in A–Z order | P2 | Yes – cheap, same page object |
| TC09 | Sorting | Positive | Name Z to A | Logged in | Choose "Name (Z to A)" | all items | Whole list in Z–A order | P2 | Yes – same helper |
| TC10 | Sorting | Boundary | Default order and order after reload | Logged in | 1. Note default order 2. Sort 3. Reload | all items | Default is A–Z; sort choice after reload is noted (spec silent) | P3 | No – behaviour unspecified; manual observation |
| TC11 | Cart | Positive | Add two, remove one in the cart | Logged in, empty cart | 1. Add two items 2. Check badge=2 3. Open cart 4. Remove one | Backpack, Bike Light | Badge 2 then 1; cart lists only the remaining item | P1 | Yes – core cart flow |
| TC12 | Cart | Positive | Remove from products page | Logged in, one item added | Click Remove on the products page | Backpack | Badge disappears; button back to "Add to cart" | P1 | Yes – second removal path from the rules |
| TC13 | Cart | Boundary | Add all 6 items, then remove all | Logged in | Add all items, check badge, remove all 6 items | Badge shows 6, then disappears | P2 | No for now – same logic as TC11; add to API/unit layer if it exists |
| TC14 | Checkout | Positive | Full checkout | Logged in, 2 items in cart | Checkout > fill info > Continue > check amounts > Finish | Test / User / 600001 | Total = item total + tax; "Thank you for your order!"; cart empty | P1 | Yes – the revenue path, smoke test |
| TC15 | Checkout | Negative | Missing first name / last name / postal code | In checkout step one, 1 item | Leave one field empty, click Continue | Matching "… is required" error; stays on step one | P1 | Yes – parameterized (TC15a-c) |
| TC16 | Checkout | Boundary | Odd postal code and name values | In checkout step one, Enter whitespace only, 1 char, 200 chars, "!!@@##", emoji | listed values | Whitespace-only rejected (Q2); others recorded as observations (Q1) | P2 | No – needs the answer to Q1/Q2 first |
| TC17 | Checkout | Negative | Cancel on the overview page | On overview with items, Click Cancel | – | Back to products; no order placed; cart keeps items | P2 | Yes – a business rule with one clear check |
| TC18 | Checkout | Negative | Checkout with an empty cart | Logged in, empty cart | Open cart, click Checkout | – | Should be blocked (Q3). Record actual behaviour | P2 | No – wait for answer to Q3; then automate |
| TC19 | Security | Negative | Products page by URL after logout | Logged out | Open /inventory.html directly | URL | Redirect to login with a "You can only access… when you are logged in" error | P1 | Yes – a stated business rule |
| TC20 | Security | Negative | Other inner pages by URL after logout | Logged out | Open /cart.html, /checkout-step-one.html, /checkout-complete.html | URLs | Same as TC19 for each | P1 | Yes – parameterized |
| TC21 | Security | Negative | Back button after logout | Logged in, then logged out | Press browser Back | – | Products page is not shown again | P2 | No – browser history behaviour, quick manual check |
| TC22 | Security | Negative | Injection strings in login and checkout fields | On login / step one | Enter `' OR 1=1 --` and `<script>alert(1)</script>` | injection strings | Login rejected; no script runs; text shown escaped | P2 | No – manual security probing first; add a scanner later |
| TC23 | Usability | Positive | Keyboard-only login and checkout | On login page | Complete the whole flow using Tab, Enter, Space only | standard_user | Focus order logical; focus visible; every step reachable | P2 | No – manual |
| TC24 | Accessibility | Positive | Screen-reader and contrast check | On each page | Run axe/Lighthouse; check labels, alt text, error announcements | all pages | No critical violations; images have alt text; errors are announced | P2 | No – manual now; an axe scan can be added later |
| TC25 | Browser / screen | Positive | Phone width (375x667) and Firefox/Safari | Logged in | Run TC01, TC11, TC14 by hand at 375px and in other browsers | – | No layout break; menu and buttons usable | P2 | No – manual now; add a mobile project later |

### Exploratory charter (15 minutes) – problem_user

**Explore** the shop and checkout flow **with** problem_user **to discover** where its behaviour differs from standard_user.

Focus on: product images, sorting, add and remove buttons, cart contents and badge, checkout form fields (can all three fields be filled in?) and the final total. Take notes of anything that differs from standard_user, with a screenshot. Record the questions this raises for the product owner.

1. All products show the same product image.
2. Sorting does not change the order of the list.
3. Add to cart does not work for 3 products. For the other 3 it works only after a delay.
4. Clicking a product opens the details page of a different product (for example, Sauce Labs Backpack opens Sauce Labs Fleece Jacket.).
5. The last name field in checkout cannot be filled in, so checkout cannot be completed (blocker).

Not covered: ____ (for example the final total, since checkout was blocked).

**Questions for the product owner**
1. Is problem_user meant to behave differently from standard_user, or are these defects to fix? Which of these differences are intended for the demo?
2. Should every product have its own image? Is there a fallback image if one is missing?
3. Should sorting work for all users? Is there a rule that disables it for some accounts?
4. What should happen when an item cannot be added to the cart: an error message, a disabled button, or nothing? Is a delay in updating the cart acceptable, and how long?
5. Should clicking a product always open that product's page? Which product ID should be used when the link and the product disagree?
6. Which of these must be fixed before release? Since the last-name field blocks checkout, I would treat it as critical.
7. If checkout can't be completed, should the user see a message, and what is the support route for these users?

## 3. Strategy (under 150 words)

**UI layer (Playwright):** the P1 flows and business rules: login, locked-out user, sorting, cart add/remove, full checkout, required-field errors, cancel, URL access when logged out. A small @smoke subset runs on every build.

**API/unit layer (if the client has one):** price and tax calculation, sort logic, input validation rules (postal code, whitespace), and auth checks on protected endpoints. These are faster and more precise there.

**Manual:** usability, accessibility, security probing, cross-browser and phone width, and exploratory work with the known-problem users.

**Biggest remaining risks:** the money maths and the unspecified rules (Q1, Q3, Q4). Considering having a problem account is intentional, an empty cart may be allowed to check out is the biggest risk. I would report this until the product owner confirms them. Checkout reliability and the unconfirmed money rules. 