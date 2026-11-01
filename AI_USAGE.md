# AI usage log

> IMPORTANT FOR THE CANDIDATE: edit the "What I changed" column to say what YOU actually checked and changed.
> Only keep entries that are true. The reviewers score how well you checked the output.

| # | Where used | Tool | What I asked for | What I checked / changed |
|---|---|---|---|---|
| 1 | Whole Section A framework (src/, tests/, playwright.config.ts) | Claude | Playwright + TypeScript framework with POM, fixtures, env config, screenshots and reports for the Sauce Demo shop flow | 18 automated test cases have been run and all 18 testcases passed. Dev tools. Checked the data-test locators in Chrome DevTools against the live site; no mismatches found. There were three timeout failures suspected to be slow internet connection which got fixed post change in wifi. To fix this, longer timeouts, 2 workers, no fixed sleeps could be implemented|
| 2 | docs/A1_manual_tests.md | Claude | Draft of questions, 25 test cases, charter and strategy | Ran the 15-minute exploratory session with problem_user on the live site and recorded five findings in the charter notes. Added questions for the product owner based on them. Added an oracle and session notes to the charter. Rewrote the biggest-risk paragraph in the strategy. Corrected the wordings for a few testcases|
| 3 | ANSWERS.md sections B1-B4 | Claude | First drafts | TODO: note what you rewrote in your own words |
| 4 | README.md | Claude | Setup, run commands, traceability table, scaling paragraph | TODO: note corrections (for example the real run output) |
