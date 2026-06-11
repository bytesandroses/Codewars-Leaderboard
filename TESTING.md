# Testing Documentation

## 1. The website must contain an input to accept a comma-separated list of users

**Manual Testing:** Opened the application, entered multiple usernames separated by commas in the textarea (e.g., "CodeYourFuture, 40thieves, SallyMcGrath"), and submitted the form. Verified that the form accepts the input and processes all provided usernames.

---

## 2. Submitting the list of users fetches data from the Codewars API about each of the users

**Manual Testing:** Submitted a list of usernames whose data is known and verified that the leaderboard was accurate (username, clan, score). Also checked the browser's Network tab to confirm outgoing requests to `https://www.codewars.com/api/v1/users/{username}`.

---

## 3. Based on the leaderboard data, a drop-down is shown, allowing the user to pick from all of the possible language rankings plus the overall ranking

**Manual Testing:** Verified that the dropdown filtered language and scores for users accurately from the fetched data. Confirmed it contains "Overall" plus all languages shared across the fetched users.

---

## 4. The default ranking selected is the overall ranking

**Manual Testing:** Ensured that automatic results are "overall" unless otherwise selected by dropdown filter.

---

## 5. A table is shown for the current ranking, with columns for each user's username, clan and score

**Manual Testing:** Submitted valid usernames and inspected the table headers and rows to confirm three columns exist: Username, Clan, Score. Verified each row contains the correct data mapped to the correct column.

---

## 6. Changing the selected ranking will update the table to reflect the newly selected ranking

**Manual Testing:** Submitted usernames, then selected different languages from the dropdown. Verified the table re-renders each time with scores specific to the selected language.

---

## 7. The table is sorted from the highest to lowest score, top to bottom

**Unit tests in `index.test.mjs`.** The `sortUsersByScore` function uses `scoreB - scoreA` to sort in descending order. Tests verify:

- Users are sorted highest to lowest by overall score
- Users are sorted correctly by language-specific scores
- Original array is not mutated

Additionally tested manually by submitting users with known scores and verifying the top-scoring user appears in the first row.

---

## 8. Users without a ranking in a chosen language are not shown in that table

**Manual Testing:** Submitted users where some had rankings in "python" and others did not. Selected "python" from the dropdown and verified that only users with a `python` ranking appeared in the table. Users without that language ranking were correctly omitted.

---

## 9. The top user's score is visually highlighted

**Manual Testing:** Submitted multiple usernames and inspected the DOM to confirm the first row has the `leaderboard-top` class applied. Verified the CSS styling (yellow background, bold text) renders correctly on the top-scoring user.

---

## 10. The website must score 100 for accessibility in Lighthouse

**Manual Testing:** Using Chrome DevTools Lighthouse. Ran an accessibility audit on the page and verified the score. Ensured semantic HTML (`&lt;&lt;table&gt;`, `&lt;th scope="col"&gt;`, `&lt;label&gt;`, `&lt;caption&gt;`), ARIA live region for error messages (`role="alert"`, `aria-live="polite"`), and proper color contrast in CSS.

---

## 11. Unit tests must be written for at least one non-trivial function

See (7)

---

## 12. Searching for a user which doesn't exist should show a message to the user explaining this

**Manual Testing:** Submitted a username that does not exist on Codewars (e.g., "thisuserdoesnotexist12345"). Verified that the error message container displays "User \"thisuserdoesnotexist12345\" not found (404)."

---

## 13. If multiple users were searched for, it is acceptable to either just error, or to show the valid users, but the user should be made aware of the invalid users

**Manual Testing:** Submitted a mix of valid and invalid usernames (e.g., "CodeYourFuture, fakeuser123, 40thieves"). Verified that valid users appear in the leaderboard and the error message lists all invalid users with their specific error reasons (404 not found).

---

## 14. If fetching from the Codewars API errors (e.g. because you're offline, or made a bad request), the user must be shown a useful error message in the UI

**Manual Testing:** Switched off WiFi, then submitted usernames. Verified the error message displays "Failed to fetch \"{username}\". Check your internet connection." for each user. Also tested by temporarily breaking the API URL to simulate bad requests.
