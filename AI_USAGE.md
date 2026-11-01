# AI usage log

> IMPORTANT FOR THE CANDIDATE: edit the "What I changed" column to say what YOU actually checked and changed.
> Only keep entries that are true. The reviewers score how well you checked the output.

| # | Where used | Tool | What I asked for | What I checked / changed |
|---|---|---|---|---|
| 1 | Whole Section A framework (src/, tests/, playwright.config.ts) | Claude | Playwright + TypeScript framework with POM, fixtures, env config, screenshots and reports for the Sauce Demo shop flow | 18 automated test cases have been run and all 18 testcases passed. Dev tools. Checked the data-test locators in Chrome DevTools against the live site; no mismatches found. There were three timeout failures suspected to be slow internet connection which got fixed post change in wifi. To fix this, longer timeouts, 2 workers, no fixed sleeps could be implemented|
| 2 | docs/A1_manual_tests.md | Claude | Draft of questions, 25 test cases, charter and strategy | Ran the 15-minute exploratory session with problem_user on the live site and recorded five findings in the charter notes. Added questions for the product owner based on them. Added an oracle and session notes to the charter. Rewrote the biggest-risk paragraph in the strategy. Corrected the wordings for a few testcases|
| 3 | ANSWERS.md sections B1-B4 | Claude | First drafts | Reviewed the problems found and ran the B1 rewrite as a spec file and it passed. Filled in the B3 environment details (Chrome 156.0.8078.74, Windows 11, full inventory URL).  Reworded B4 in my own words and checked it is under 150 words. |
| 4 | README.md | Claude | Setup, run commands, traceability table, scaling paragraph | Followed the setup and run steps on Windows 11 in the VS Code terminal and confirmed they work: `npm install`, `npx playwright install chromium`, `npm test` (18 tests passed). Replaced the `cp .env.example .env` command with `copy .env.example .env` for Windows and added a note about the PowerShell execution policy error. Checked that the traceability table matches the test names in the spec files. Added the extra test for B1 (checkout_total.spec.ts) to the table. |
